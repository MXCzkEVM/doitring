import { Injectable, Logger } from '@nestjs/common'
import { bgWhite, dim, reset, yellow } from 'chalk'
import dayjs from 'dayjs'
import { cellToLatLng } from 'h3-js'
import { Prisma } from '@prisma/client'
import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'
import { parseHexagon } from '../../utils'
import { Events } from './types'
import { isMep3355, parseDataJsonPacket } from './utils'

@Injectable()
export class EventsService {
  constructor(
    private ethers: EthersService,
    private prisma: PrismaService,
    private user: UserService,
  ) { }

  private readonly logger = new Logger('event')

  async Claimed(event: Events['Claimed']) {
    if (!isMep3355(event.args.memo))
      return
    this.logger.log(reset(`Transaction hash: ${dim(event.transactionHash)}`))
    this.logger.log(reset(`Ring Data Packet: ${dim(`${event.args.token} | #${event.args.tokenId}`)}`))

    const dataJsonPacket = parseDataJsonPacket(event.args.memo, event.args.sncode)

    await Promise.all([
      this.prisma.sleep.createMany({ data: dataJsonPacket.sleeps }),
      this.prisma.bloodOxygen.createMany({ data: dataJsonPacket.oxygens }),
      this.prisma.heartRate.createMany({ data: dataJsonPacket.rates }),
      this.prisma.step.createMany({ data: dataJsonPacket.steps }),
    ])

    await this.prisma.claimed.create({
      data: {
        timestamp: new Date(Number(event.args.timestamp) * 1000),
        hash: event.transactionHash,
        sncode: event.args.sncode,
        token: event.args.token,
        tokenId: Number(event.args.tokenId),
        uid: event.args.uid,
      },
    })

    await this.user.ensure(event.args.to)

    const date = Number(event.args.timestamp) * 1000
    await this.prisma.user.updateMany({
      where: { device: event.args.sncode },
      data: { updateAt: new Date(date) },
    })

    this.printlnParsedMessage('claimed', [
      'were z at',
      yellow(event.args.to),
      'claimed',
      'in',
      yellow(event.transactionHash.slice(0, 12)),
    ])
  }

  async Registered(event: Events['Registered']) {
    const mapping = await this.ethers.DoitRingDevice.getTokenInDevice(event.args.sncode)

    await this.user.ensure(event.args.sender)

    await this.prisma.user.update({
      data: { device: event.args.sncode, score: 0 },
      where: { owner: event.args.sender },
    })

    await this.prisma.device.create({
      data: {
        tokenId: Number(mapping.tokenId),
        token: mapping.token,
        sncode: event.args.sncode,
      },
    })

    this.printlnParsedMessage('binded', [
      'user',
      yellow(event.args.sender),
      'rebind',
      yellow(`${mapping.token.slice(0, 12)} #${mapping.tokenId}`),
      'in',
      yellow(event.transactionHash.slice(0, 12)),
    ])
  }

  async Binded(event: Events['Binded']) {
    const owner = event.args.owner
    const sncode = event.args.sncode
    const mapping = await this.ethers.DoitRingDevice.getTokenInDevice(sncode)

    await this.user.ensure(owner)

    await this.prisma.user.update({
      where: { owner },
      data: {
        device: sncode,
        score: 0,
      },
    })

    this.printlnParsedMessage('binded', [
      'user',
      yellow(owner),
      'rebind',
      yellow(`${mapping.token.slice(0, 12)} #${mapping.tokenId}`),
      'in',
      yellow(event.transactionHash.slice(0, 12)),
    ])
  }

  async GroupCreated(event: Events['GroupCreated']) {
    const pinataURL = 'https://gateway.pinata.cloud/ipfs'
    const response = await fetch(`${pinataURL}/${event.args.tokenURI}`)
    const metadata = await response.json()
    const time = dayjs.unix(Number(event.args.timestamp)).valueOf()

    const data: Prisma.GroupCreateInput = {
      creator: event.args.creator,
      id: Number(event.args.group),
      image: `${pinataURL}/${metadata.image}`,
      name: metadata.name,
      description: metadata.description,
      attributes: `${metadata.attributes}`,
      opening: metadata.type === 'open',
      timestamp: new Date(time),
    }

    if (metadata.hexagon) {
      try {
        const { address } = await parseHexagon(metadata.hexagon)
        const [lat, lon] = cellToLatLng(metadata.hexagon)

        data.countryCode = address.country_code?.toUpperCase?.()
        data.hexagon = metadata.hexagon
        data.country = address.country
        data.state = address.state
        data.city = address.city
        data.lat = lat
        data.lon = lon
      }
      catch {}
    }

    await this.prisma.group.create({ data })
    this.printlnParsedMessage('group', [
      `${metadata.name} #${event.args.group}`,
      'created',
      'by',
      yellow(event.args.creator.slice(0, 12)),
    ])
  }

  async GroupJoined(event: Events['GroupJoined']) {
    await this.user.ensure(event.args.user)
    await this.prisma.user.update({
      where: { owner: event.args.user },
      data: { group: Number(event.args.group) },
    })
    this.printlnParsedMessage('group', [
      'user',
      yellow(event.args.user.slice(0, 12)),
      'join',
      `#${event.args.group}`,
    ])
  }

  async StorageUpdated(event: Events['StorageUpdated']) {
    const store = event.args.store
    const key = event.args.key
    const value = event.args.value
    if (!store.startsWith('ring_') || !['avatar', 'nickname'].includes(key))
      return
    await this.prisma.user.updateMany({
      where: { device: store.split('_')[1] },
      data: { [key]: value },
    })
    this.printlnParsedMessage('user', [`Update user ${key} to ${value}`])
  }

  async printlnParsedMessage(type: string, messages: string[]) {
    this.logger.log(reset(`${bgWhite(`[${type}]`)} - ${messages.join(' ')}`))
  }
}
