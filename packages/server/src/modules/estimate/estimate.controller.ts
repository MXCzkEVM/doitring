import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NumericResponse } from '../common'
import { EstimateService } from './estimate.service'

@ApiTags('Estimate')
@Controller('estimate')
export class EstimateController {
  constructor(
    private readonly estimate: EstimateService,
  ) {}

  @Get('bonus/stake')
  @ApiQuery({ name: 'owner', type: 'string' })
  @ApiResponse({ type: NumericResponse })
  async bonusStak(@Query('owner') owner: string) {
    const bonus = await this.estimate.bonusInStakesByOwner(owner)
    return { data: bonus }
  }
}
