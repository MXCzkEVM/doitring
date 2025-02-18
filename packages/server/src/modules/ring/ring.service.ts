import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../common'

@Injectable()
export class RingService {
  constructor(private prisma: PrismaService) {}

  async listsByStep(params: Prisma.StepFindManyArgs) {
    return this.prisma.step.findMany(params)
  }

  async listsByBloodOxygen(params: Prisma.BloodOxygenFindManyArgs) {
    return this.prisma.bloodOxygen.findMany(params)
  }

  async listsByHeartRate(params: Prisma.HeartRateFindManyArgs) {
    return this.prisma.heartRate.findMany(params)
  }

  async listsBySleep(params: Prisma.SleepFindManyArgs) {
    return this.prisma.sleep.findMany(params)
  }

  async countByBloodOxygen(params: Prisma.BloodOxygenCountArgs) {
    return this.prisma.bloodOxygen.count(params)
  }

  async countByStep(params: Prisma.StepCountArgs) {
    return this.prisma.step.count(params)
  }

  async countByHeartRate(params: Prisma.HeartRateCountArgs) {
    return this.prisma.heartRate.count(params)
  }

  async countBySleep(params: Prisma.SleepCountArgs) {
    return this.prisma.sleep.count(params)
  }

  async totalByStep(where?: Prisma.StepWhereInput) {
    const { _sum: { value = 0 } } = await this.prisma.step.aggregate({
      _sum: { value: true },
      where,
    })
    return value
  }

  async someClaimed(hash: string) {
    const count = await this.prisma.claimed.count({ where: { hash } })
    return count !== 0
  }
}
