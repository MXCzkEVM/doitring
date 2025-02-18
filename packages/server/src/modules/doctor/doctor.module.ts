import { Module } from '@nestjs/common'
import { EthersService, PrismaService } from '../common'
import { DoctorController } from './doctor.controller'

@Module({
  controllers: [
    DoctorController,
  ],
  providers: [
    EthersService,
    PrismaService,
  ],
})
export class DoctorModules {}
