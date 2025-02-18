import { Module } from '@nestjs/common'
import { PrismaService } from '../common'
import { RankService } from './rank.service'
import { RankController } from './rank.controller'

@Module({
  controllers: [RankController],
  providers: [
    PrismaService,
    RankService,
  ],
})
export class RankModule {}
