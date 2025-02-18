import { Module } from '@nestjs/common'
import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'

@Module({
  providers: [
    EthersService,
    PrismaService,
    UserService,
  ],
})
export class EventsModules {}
