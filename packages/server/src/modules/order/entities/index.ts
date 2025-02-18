import { ApiProperty } from '@nestjs/swagger'

export class OrderEntity {
  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  region: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  address: string

  @ApiProperty()
  size: number

  @ApiProperty()
  invitation?: string
}

export class Order {
  @ApiProperty()
  id: number

  @ApiProperty()
  variable: number

  @ApiProperty()
  payment: number

  @ApiProperty()
  product: number

  @ApiProperty()
  secret: string
}
