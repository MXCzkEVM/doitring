import { Module } from '@nestjs/common'
import { EthersService, PrismaService } from '../common'
import { OrderController } from './order.controller'

@Module({
  controllers: [OrderController],
  providers: [PrismaService, EthersService],
})
export class OrderModule {}
