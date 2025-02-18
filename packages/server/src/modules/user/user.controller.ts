import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { NumericResponse } from '../common'
import { UserService } from './user.service'
import { User } from './entities'
import { UserResponse } from './dtos'

@ApiTags('User')
@Controller('user')
@ApiExtraModels(User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':address')
  @ApiResponse({ status: 200, type: UserResponse, description: 'User' })
  async getUser(@Param('address') address: string) {
    const detail = await this.userService.detail(address)
    return { data: detail }
  }

  @Get('score/total')
  @ApiQuery({ name: 'group', type: 'number' })
  @ApiResponse({ status: 200, type: NumericResponse, description: 'Score' })
  async getScoreTotal(
    @Query('group') group?: number,
  ) {
    const where: Prisma.UserWhereInput = {}
    if (group)
      where.group = +group
    const data = await this.userService.sorceTotal(where)
    return { data }
  }
}
