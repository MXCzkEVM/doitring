import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { LogInterceptor } from './flow'
import { EthersService, LoggerService, PrismaService } from './services'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    LoggerService,
    PrismaService,
    EthersService,
    LogInterceptor,
  ],
  exports: [
    LoggerService,
    PrismaService,
    EthersService,
    LogInterceptor,
  ],
})

export class CommonModule {}
