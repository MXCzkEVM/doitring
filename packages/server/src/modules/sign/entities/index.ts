import { ApiProperty } from '@nestjs/swagger'

export class Reward {
  @ApiProperty()
  token: string

  @ApiProperty()
  amount: string
}
