import { Module } from '@nestjs/common'
import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'
import { RingService } from '../ring'
import { SeasonService } from '../season'
import { EstimateService } from './estimate.service'
import { EstimateController } from './estimate.controller'

@Module({
  controllers: [EstimateController],
  providers: [
    EstimateService,
    EthersService,
    SeasonService,
    PrismaService,
    UserService,
    RingService,
  ],
})
export class EstimateModules {}
