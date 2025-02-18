import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'
import { RingService } from '../ring'
import { EventsService } from '../events'
import { EstimateService } from '../estimate'
import { SeasonService } from '../season'
import { TaskService } from './task.service'

@Module({
  providers: [
    EstimateService,
    PrismaService,
    ConfigService,
    EthersService,
    EventsService,
    SeasonService,
    TaskService,
    UserService,
    RingService,
  ],
})

export class TaskModule {}
