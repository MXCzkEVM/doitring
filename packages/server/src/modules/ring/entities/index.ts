import { ApiProperty } from '@nestjs/swagger'

export class RingData {
  @ApiProperty()
  date: number

  @ApiProperty()
  value: number

  @ApiProperty()
  token: string

  @ApiProperty()
  tokenId: number
}

export class RingDataStep extends RingData {
  @ApiProperty()
  kcal: number

  @ApiProperty()
  km: number
}
