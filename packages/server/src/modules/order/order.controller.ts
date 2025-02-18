import { Body, Controller, Logger, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import WooCommerceRestApi, { OrdersMainParams } from 'woocommerce-rest-ts-api'
import { Stripe } from 'stripe'
import { parseEther } from 'ethers'
import { defaultAddresses as addresses, contracts, defaultChain } from '@harsta/client'
import { gray } from 'chalk'
import { EthersService, PrismaService } from '../common'
import { loop } from '../../utils'
import { OrderConfirmBody, OrderCreateBody } from './dtos'
import { Order } from './entities'
import { RING_PRODUCT_ID, RING_SIZES } from './constants'

@ApiTags('Order')
@Controller('order')
export class OrderController {
  woocommerce: WooCommerceRestApi<{
    url: string
    consumerKey: string
    consumerSecret: string
  }>

  logger: Logger = new Logger('Order')
  stripe: Stripe

  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
  ) {
    this.woocommerce = new WooCommerceRestApi({
      url: 'https://c.xyz',
      consumerKey: process.env.NEST_WOOC_CONSUMER_KEY!,
      consumerSecret: process.env.NEST_WOOC_CONSUMER_SECRET!,
      version: 'wc/v3',
      queryStringAuth: false,
    })
    this.stripe = new Stripe(process.env.NEST_STRIPE_SECRET_KEY)
  }

  @Post('')
  @ApiBody({ type: OrderCreateBody, required: true })
  @ApiResponse({ type: Order })
  async create(@Body() body: OrderCreateBody) {
    const address = {
      first_name: defaultChain.id === 5167004 ? `Test order` : body.name,
      address_1: body.address,
      country: body.region,
      phone: body.phone,
      email: body.email,
      address_2: '',
      last_name: '',
      postcode: '',
      company: '',
      state: '',
      city: '',
    }
    const data: OrdersMainParams = {
      payment_method: 'bacs',
      payment_method_title: 'card',
      set_paid: false,
      shipping: address,
      billing: address,
      line_items: [
        {
          product_id: RING_PRODUCT_ID,
          variation_id: RING_SIZES[body.size],
          quantity: 1,
        },
      ],
    }

    if (body.invitation) {
      const { token } = await this.ethers.DoitRingDevice.getTokenInAddress(body.invitation)
      if (token === addresses.ZERO)
        throw new Error('Invitation address not bound to ring')
    }

    const response = await this.woocommerce.post('orders', data)
    const intent = await this.stripe.paymentIntents.create({
      amount: body.invitation ? 314 : 349,
      payment_method_types: ['card'],
      currency: 'usd',
    })
    const order = await this.prisma.order.create({
      data: {
        id: response.data.id,
        product: RING_PRODUCT_ID,
        variable: RING_SIZES[body.size],
        secret: intent.client_secret,
        inviter: body.invitation,
      },
    })
    this.logger.log(gray`Order #${order.id} has been created`)
    return order
  }

  @Post('confirm')
  @ApiBody({ type: OrderConfirmBody, required: true })
  @ApiResponse({ type: Order })
  async confirm(@Body() body: OrderConfirmBody) {
    if (!body.secret || !body.paymentIntent)
      throw new Error('Not secret')
    const intent = await this.stripe.paymentIntents.retrieve(body.paymentIntent)

    if (intent.status !== 'succeeded')
      throw new Error('Payment failed')

    const order = await this.prisma.order.findFirst({
      where: { secret: body.secret },
    })
    const { data: detail } = await this.woocommerce.get('orders', { id: order.id })

    if (!order || !detail)
      throw new Error('Order does not exist')

    if (order.payment === 1) {
      if (order.inviter && !order.rebate)
        this.cashback(order.id, order.inviter, detail.shipping.first_name)
      return order
    }

    await this.woocommerce.put('orders', { set_paid: true }, { id: order.id })
    const updatedOrder = await this.prisma.order.update({
      where: { id: +order.id },
      data: { payment: 1 },
    })

    if (order.inviter && !order.rebate)
      this.cashback(order.id, order.inviter, detail.shipping.first_name)

    this.logger.log(gray`Order #${order.id} has been paid, payment intent ${body.paymentIntent}`)
    return updatedOrder
  }

  async cashback(order: number, receiver: string, name: string) {
    const ERC20 = contracts.ERC20.attach(addresses.USDT, this.ethers.owner)

    const allowance = await ERC20.allowance(
      this.ethers.owner.address,
      addresses.Savings,
    )

    if (allowance < parseEther('70')) {
      this.logger.log(gray`authorization ${addresses.Savings.slice(0, 9)} cashback contract allowance max`)
      const transaction = await ERC20.approve(
        addresses.Savings,
        `0x${'f'.repeat(64)}`,
      )
      await transaction.wait()
    }

    const transaction = await this.ethers.Savings.deposit(
      receiver,
      addresses.USDT,
      parseEther('70'),
      name || '',
    )
    const receipt = await transaction.wait()
    await this.prisma.order.update({
      data: { rebate: receipt.hash },
      where: { id: +order },
    })
    await this.prisma.user.update({
      data: { invited: { increment: 1 } },
      where: { owner: receiver },
    })
    this.logger.log(gray`Order #${order} cashback sended(hash: ${receipt.hash})`)
  }
}
