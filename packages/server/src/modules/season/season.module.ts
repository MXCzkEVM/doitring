import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EthersService, PrismaService } from '../common'
import { SeasonService } from './season.service'
import { SeasonController } from './season.controller'

@Module({
  controllers: [SeasonController],
  providers: [
    PrismaService,
    ConfigService,
    EthersService,
    SeasonService,
  ],
})
export class SeasonModule {}
