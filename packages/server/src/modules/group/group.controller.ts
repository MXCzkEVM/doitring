import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { BooleanResponse } from '../common'
import { NumberEncryptor } from '../sign/utils'
import { ConditionType, GroupService } from './group.service'
import { Group, Member } from './entities'
import { ConditionsResponse, MemberPageResponse, TokenPageResponse } from './dtos'

@ApiTags('Group')
@Controller('group')
@ApiExtraModels(TokenPageResponse)
@ApiExtraModels(MemberPageResponse)
@ApiExtraModels(Member)
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Get('/detail/:id')
  @ApiResponse({ status: 200, type: Group, description: 'Group' })
  async getGroup(@Param('id') id: number) {
    const data = await this.service.detail({ id: +id })
    return { ...data, invite: NumberEncryptor.encrypt(data.id) }
  }

  @Get('/invite/:in')
  @ApiResponse({ status: 200, type: Group, description: 'Group' })
  async getGroupByInvite(@Param('in') invite: string) {
    return this.getGroup(NumberEncryptor.decrypt(invite))
  }

  @Get()
  @ApiQuery({ name: 'keyword', type: 'string' })
  @ApiQuery({ name: 'members', type: 'string', required: false })
  @ApiQuery({ name: 'score', type: 'string', required: false })
  @ApiQuery({ name: 'countryCode', type: 'string', required: false })
  @ApiResponse({ status: 200, type: TokenPageResponse, description: 'Group' })
  async getGroups(
    @Query('keyword') keyword = '',
    @Query('members') _members = '',
    @Query('score') score = '',
    @Query('countryCode') countryCode = '',
  ) {
    const where: Prisma.GroupWhereInput = {
      name: { contains: keyword },
      opening: true,
    }

    if (score)
      where.score = { gt: +score }

    if (countryCode)
      where.countryCode = countryCode

    const data = await this.service.lists({ where })
    return { data }
  }

  @Get('/detail/:id/members')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, type: MemberPageResponse, description: 'Group' })
  async getGroupMembers(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 4,
  ) {
    const data = await this.service.members({
      where: { group: +id },
      skip: (page - 1) * limit,
      take: +limit,
    })
    return { data }
  }

  @Get('condition')
  @ApiQuery({ name: 'type', type: 'string' })
  @ApiQuery({ name: 'address', type: 'string' })
  @ApiResponse({ status: 200, type: BooleanResponse, description: 'Group' })
  async getGroupCond(@Query('type') type: ConditionType, @Query('address') address: string) {
    return { data: await this.service.condition(type, address) }
  }

  @Get('conditions')
  @ApiQuery({ name: 'address', type: 'string' })
  @ApiResponse({ status: 200, type: ConditionsResponse, description: 'Group' })
  async getGroupConds(@Query('address') address: string) {
    return this.service.conditions(address)
  }
}
