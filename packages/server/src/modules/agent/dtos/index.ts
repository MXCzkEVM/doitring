import { ApiProperty } from '@nestjs/swagger'

export class AgentTransactionBody {
  @ApiProperty()
  method?: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string

  @ApiProperty()
  data: string

  @ApiProperty()
  signature: string
}

export class AgentMessageBody {
  @ApiProperty()
  method?: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string
}

export class AgentMessageResponse {
  @ApiProperty()
  data: string
}

export class AgentTransactionResponse {
  @ApiProperty()
  _type: 'TransactionResponse'

  @ApiProperty()
  chainId: string

  @ApiProperty()
  data: string

  @ApiProperty()
  from: string

  @ApiProperty()
  to: string

  @ApiProperty()
  gasLimit: string

  @ApiProperty()
  gasPrice: string

  @ApiProperty()
  hash: string

  @ApiProperty()
  value: string
}
