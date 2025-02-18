import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { BooleanResponse, NumericResponse } from '../common'
import { RingService } from './ring.service'
import { DataPacketResponse } from './dtos'
import { RingData, RingDataStep } from './entities'

@ApiTags('Ring')
@Controller('ring')
@ApiExtraModels(RingData)
@ApiExtraModels(RingDataStep)
export class RingController {
  constructor(private readonly ringService: RingService) {}

  @Get('sleeps')
  @ApiQuery({ name: 'date', type: 'number', required: false })
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: DataPacketResponse, description: 'Ring Data Packet' })
  async getSleeps(
    @Query('sncode') sncode: string,
    @Query('date') date?: string,
  ) {
    const where: Prisma.SleepWhereInput = { sncode }
    if (date)
      where.date = { lte: date }

    const data = await this.ringService.listsBySleep({
      orderBy: { date: 'desc' },
      where,
    })
    const total = await this.ringService.countBySleep({ where })

    return { data, total }
  }

  @Get('oxygens')
  @ApiQuery({ name: 'date', type: 'number', required: false })
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: DataPacketResponse, description: 'Ring Data Packet' })
  async getBloodOxygens(
    @Query('sncode') sncode: string,
    @Query('date') date?: string,
  ) {
    const where: Prisma.BloodOxygenWhereInput = { sncode }
    if (date)
      where.date = { lte: date }
    const data = await this.ringService.listsByBloodOxygen({
      orderBy: { date: 'desc' },
      where,
    })
    const total = await this.ringService.countByBloodOxygen({ where })
    return { data, total }
  }

  @Get('rates')
  @ApiQuery({ name: 'date', type: 'number', required: false })
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: DataPacketResponse, description: 'Ring Data Packet' })
  async getHeartRates(
    @Query('sncode') sncode: string,
    @Query('date') date?: string,
  ) {
    const where: Prisma.HeartRateWhereInput = { sncode }
    if (date)
      where.date = { lte: date }
    const data = await this.ringService.listsByHeartRate({
      orderBy: { date: 'desc' },
      where,
    })
    const total = await this.ringService.countByHeartRate({ where })
    return { data, total }
  }

  @Get('steps')
  @ApiQuery({ name: 'date', type: 'number', required: false })
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: DataPacketResponse, description: 'Ring Data Packet' })
  async getSteps(
    @Query('sncode') sncode: string,
    @Query('date') date?: string,
  ) {
    const where: Prisma.StepWhereInput = { sncode }
    if (date)
      where.date = { lte: date }
    const data = await this.ringService.listsByStep({
      orderBy: { date: 'desc' },
      where,
    })
    const total = await this.ringService.countByStep({ where })
    return { data, total }
  }

  @Get('steps/total')
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: NumericResponse, description: 'Step Total' })
  async getStepsTotal(
    @Query('sncode') sncode: string,
  ) {
    return { data: await this.ringService.totalByStep({ sncode }) }
  }

  @Get('wearing')
  @ApiQuery({ name: 'sncode', type: 'string' })
  @ApiResponse({ status: 200, type: NumericResponse, description: 'Step Total' })
  async getWearingTime(
    @Query('sncode') sncode: string,
  ) {
    const length = await this.ringService.countByBloodOxygen({
      orderBy: { date: 'desc' },
      where: { sncode },
    })
    return { data: length * 1800 }
  }

  @Get('claimed/:hash')
  @ApiResponse({ status: 200, type: BooleanResponse, description: 'Claimed some' })
  async getClaimedSome(@Param('hash') hash: string) {
    return this.ringService.someClaimed(hash)
  }
}
