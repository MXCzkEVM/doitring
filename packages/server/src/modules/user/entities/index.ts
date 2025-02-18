import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty()
  owner: string

  @ApiProperty()
  score: number

  @ApiProperty()
  group?: string

  @ApiProperty()
  sncode: number

  @ApiProperty()
  token: string

  @ApiProperty()
  tokenId: number

  @ApiProperty()
  avatar?: string

  @ApiProperty()
  nickname?: string

  @ApiProperty()
  updateAt?: string

  @ApiProperty()
  pointInBasic: number

  @ApiProperty()
  pointInJsons: string

  @ApiProperty()
  bonusInToken: number

  @ApiProperty()
  bonusIsGroup: number

  @ApiProperty()
  invited: number
}
