import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaService } from '../common'
import { UsersResponse } from '../user/dtos'

@ApiTags('Rank')
@Controller('rank')
export class RankController {
  constructor(private prisma: PrismaService) {}

  @Get('/global')
  @ApiResponse({ type: UsersResponse })
  async global() {
    const data = await this.prisma.user.findMany({
      where: { invited: { gt: 0 } },
      take: 3,
    })
    return { data }
  }

  @Get('/group')
  @ApiQuery({ name: 'owner', type: 'string' })
  @ApiResponse({ type: UsersResponse })
  async group(@Query('owner') owner: string) {
    const user = await this.prisma.user.findFirst({ where: { owner } })

    if (!user || !user.group)
      return { data: [] }

    const data = await this.prisma.user.findMany({
      where: { invited: { gt: 0 }, group: user.group },
      take: 3,
    })

    return { data }
  }
}
