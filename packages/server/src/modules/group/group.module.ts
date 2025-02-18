import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EthersService, PrismaService } from '../common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'

@Module({
  controllers: [GroupController],
  providers: [
    PrismaService,
    ConfigService,
    EthersService,
    GroupService,
  ],
})
export class GroupModule {}
