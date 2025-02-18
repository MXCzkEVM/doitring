import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Reward } from '../entities'

export class ClaimSignatureResponse {
  @ApiProperty()
  uid: string

  @ApiProperty()
  signature: string

  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Reward) },
  })
  rewards: Reward[]
}
export class SignatureResponse {
  @ApiProperty()
  data: string
}

export class ClaimIntelResponse {
  @ApiProperty()
  claimed: number

  @ApiProperty()
  claims: number

  @ApiProperty()
  sncode: string

  @ApiProperty()
  amount: string

  @ApiProperty()
  level: number

  @ApiProperty()
  uid: string

  @ApiProperty()
  day: string
}
