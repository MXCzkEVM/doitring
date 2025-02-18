import { ApiProperty } from '@nestjs/swagger'
import { OrderEntity } from '../entities'

export class OrderCreateBody extends OrderEntity {
}

export class OrderPaymentBody {
  @ApiProperty()
  order: number
}

export class OrderPaymentResponse {
  @ApiProperty()
  secret: number
}

export class OrderConfirmBody {
  @ApiProperty()
  secret: string

  @ApiProperty()
  paymentIntent: string
}
