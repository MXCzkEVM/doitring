import { ApiProperty } from '@nestjs/swagger'

export class Season {
  @ApiProperty()
  id: number

  @ApiProperty()
  group: number

  @ApiProperty()
  rank: number

  @ApiProperty()
  score: number

  @ApiProperty()
  locked: string

  @ApiProperty()
  timestamp: string
}

export class MemberData {
  @ApiProperty()
  season: number

  @ApiProperty()
  device: number

  @ApiProperty()
  score: number

  @ApiProperty()
  rank: number

  @ApiProperty()
  address: string

  @ApiProperty()
  nickname: string

  @ApiProperty()
  avatar?: string
}
