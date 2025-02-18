import { Body, Controller, Logger, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { defaultAddresses as addresses, signer } from '@harsta/client'
import { bold, gray, reset } from 'chalk'
import { JsonRpcSigner, verifyMessage } from 'ethers'
import {
  AgentMessageBody,
  AgentMessageResponse,
  AgentTransactionBody,
  AgentTransactionResponse,
} from './dtos'
import { generateMessage, parseMessage } from './utils'

const addressesMapping: Record<string, string> = {}
for (const key in Object.keys(addresses))
  addressesMapping[addresses[key]] = key

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  logger = new Logger('Agent')

  @Post('')
  @ApiBody({ type: AgentTransactionBody, required: true })
  @ApiResponse({ type: AgentTransactionResponse })
  async dispatch(@Body() body: AgentTransactionBody) {
    const sender = verifyMessage(await parseMessage(body), body.signature)

    if (sender !== body.from)
      throw new Error('Not passed')

    try {
      const populateTransaction = await signer.populateTransaction({
        from: await signer.getAddress(),
        to: body.to,
        data: body.data,
      })
      populateTransaction.value = 0
      const transaction = await signer.sendTransaction(populateTransaction)

      this.logger.log(bold`Agent transaction sending: `)
      this.logger.log(reset`hash: ${gray(transaction.hash)}`)
      if (body.method)
        this.logger.log(reset`method: ${gray(body.method)}`)
      this.logger.log(reset`from: ${gray(body.from)}`)
      this.logger.log(reset`to: ${gray(body.to)}`)
      this.logger.log(reset`data: ${gray`${body.data.slice(0, 64)}...`}`)

      return transaction.toJSON()
    }
    catch (error) {
      return { statusCode: 500, ...error }
    }
  }

  @Post('proof')
  @ApiBody({ type: AgentMessageBody, required: true })
  @ApiResponse({ type: AgentMessageResponse })
  async proof(@Body() body: AgentMessageBody) {
    const message = await generateMessage(body)
    return { data: message }
  }
}
