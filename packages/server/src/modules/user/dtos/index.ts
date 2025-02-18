import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { PaginationResponse } from 'src/modules/common'
import { User } from '../entities'

export class UserResponse {
  @ApiProperty({ type: User, required: false })
  data?: User
}

export class UsersResponse extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(User) },
  })
  data: User[]
}
