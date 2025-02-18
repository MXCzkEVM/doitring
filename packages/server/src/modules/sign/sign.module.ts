import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'
import { GroupService } from '../group'
import { SeasonService } from '../season'
import { SignService } from './sign.service'
import { SignController } from './sign.controller'

@Module({
  controllers: [SignController],
  providers: [
    PrismaService,
    ConfigService,
    EthersService,
    SeasonService,
    GroupService,
    UserService,
    SignService,
  ],
})
export class SignModule {}
