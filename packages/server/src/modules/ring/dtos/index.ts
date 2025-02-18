import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { RingData, RingDataStep } from '../entities'

export class DataPacketResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(RingData) },
  })
  data: RingData[]

  @ApiProperty()
  total: number
}

export class DataPacketStepResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(RingDataStep) },
  })
  data: RingDataStep[]

  @ApiProperty()
  total: number
}
