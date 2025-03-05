import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EthersService, PrismaService } from '../common'
import { AgentController } from './agent.controller'

@Module({
  controllers: [AgentController],
  providers: [
    PrismaService,
    ConfigService,
    EthersService,
  ],
})
export class AgentModule {}
