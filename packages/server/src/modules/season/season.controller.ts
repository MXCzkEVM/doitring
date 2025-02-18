import { Controller, Get, Query } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MemberData, Season } from './entities'
import { SeasonService } from './season.service'
import { MembersResponse } from './dtos'

@ApiTags('Season')
@Controller('season')
@ApiExtraModels(MemberData)
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  @ApiQuery({ name: 'group', type: 'number' })
  @ApiQuery({ name: 'date', type: 'string' })
  @ApiResponse({ status: 200, type: Season, description: 'Season' })
  season(@Query('group') group: number, @Query('date') date: string) {
    return this.seasonService.season(date, { where: { group: +group } })
  }

  @Get('members')
  @ApiQuery({ name: 'season', type: 'number' })
  @ApiResponse({ status: 200, type: MembersResponse, description: 'Season' })
  async members(@Query('season') season: number) {
    return { data: await this.seasonService.members({ season: +season }) }
  }
}
