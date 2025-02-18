import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from 'src/modules/common'
import { Group, Member } from '../entities'

export class TokenPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Group) },
  })
  data: Group[]
}

export class MemberPageResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Member) },
  })
  data: Member[]
}

export class ConditionsResponse {
  @ApiProperty()
  wearing: boolean

  @ApiProperty()
  steps: boolean

  @ApiProperty()
  balance: boolean

  @ApiProperty()
  health: boolean

  @ApiProperty()
  whitelist: boolean

  @ApiProperty()
  invited: boolean
}
