import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { verifyMessage } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { AgentMessageBody, AgentMessageResponse } from '../agent/dtos'
import { generateMessage, parseMessage } from '../agent/utils'
import { EthersService } from '../common'
import { DiagnosisBody, DiagnosisResponse } from './dtos'

@ApiTags('Doctor')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly config: ConfigService,
    private readonly ethers: EthersService,
  ) {}

  @Post('diagnosis')
  @ApiBody({ type: DiagnosisBody, required: true })
  @ApiResponse({ type: DiagnosisResponse })
  async diagnosis(@Body() body: DiagnosisBody) {
    if (!['d', 'w', 'M'].includes(body.date))
      throw new Error('Abnormal time unit')

    body.lang = body.lang || 'en'

    const message = await parseMessage({
      method: [body.method, body.date, body.prompt].filter(Boolean).join(' - '),
      from: body.from,
      to: body.from,
    })

    const sender = verifyMessage(message, body.signature)

    if (sender !== body.from)
      throw new Error('Not passed')

    const sncode = await this.ethers.DoitRingDevice.getDeviceInAddress(body.from)

    if (!sncode)
      throw new Error('Not Device')

    const baseUrl = this.config.get('NEST_ADVISOR_REST_URL')
    const date = body.date.toLowerCase()
    const url = body.method === 'fortuneTeller'
      ? `${baseUrl}/api/FortuneTeller/query/${sncode}/${body.prompt}/0/${body.lang}`
      : `${baseUrl}/api/advisor/${body.method}/${sncode}/${date}/0/${body.lang}`

    console.log('debug - curl', url)
    const response = await fetch(encodeURI(url))
    const data = await response.json()
    const content = data?.result?.answer

    return { data: content }
  }

  @Post('proof')
  @ApiBody({ type: AgentMessageBody, required: true })
  @ApiResponse({ type: AgentMessageResponse })
  async proof(@Body() body: AgentMessageBody) {
    const message = await generateMessage(body)
    return { data: message }
  }
}
