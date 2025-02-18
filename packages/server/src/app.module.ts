import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import {
  AgentModule,
  CommonModule,
  DoctorModules,
  EstimateModules,
  EventsModules,
  GroupModule,
  OrderModule,
  RankModule,
  RingModule,
  SeasonModule,
  SignModule,
  TaskModule,
  UserModule,
} from './modules'
import { ENV_MODE_PATHS } from './config'

const { NODE_ENV } = process.env

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ENV_MODE_PATHS[NODE_ENV],
      isGlobal: true,
    }),
    EstimateModules,
    EventsModules,
    DoctorModules,
    CommonModule,
    SeasonModule,
    OrderModule,
    AgentModule,
    GroupModule,
    TaskModule,
    RingModule,
    UserModule,
    SignModule,
    RankModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
