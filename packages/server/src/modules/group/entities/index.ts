import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../user/entities'

export class Group {
  @ApiProperty()
  id: number

  @ApiProperty()
  description: string

  @ApiProperty()
  creator: string

  @ApiProperty()
  score: number

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  attributes: string[]

  @ApiProperty()
  name: string

  @ApiProperty()
  image: string

  @ApiProperty()
  country: string

  @ApiProperty()
  city: string

  @ApiProperty()
  state: string

  @ApiProperty()
  members: number

  @ApiProperty()
  timestamp: string

  @ApiProperty()
  invite: string

  @ApiProperty()
  opening: boolean

  @ApiProperty()
  hexagon: string
}

export class Member extends User {
  @ApiProperty()
  wearing: number

  @ApiProperty()
  updateAt: string
}
