import { Module } from '@nestjs/common'
import { PrismaService } from '../common'
import { RingService } from './ring.service'
import { RingController } from './ring.controller'

@Module({
  controllers: [RingController],
  providers: [
    PrismaService,
    RingService,
  ],
})
export class RingModule {}
