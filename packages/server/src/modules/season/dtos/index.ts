import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { MemberData } from '../entities'

export class MembersResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(MemberData) },
  })
  data: MemberData[]

  @ApiProperty()
  total: number
}
