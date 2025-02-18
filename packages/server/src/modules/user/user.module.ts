import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EthersService, PrismaService } from '../common'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    ConfigService,
    EthersService,
    UserService,
  ],
})

export class UserModule {}
