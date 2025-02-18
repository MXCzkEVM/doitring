import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { contracts, defaultAddresses } from '@harsta/client'
import { getAddress } from 'ethers'
import { EthersService, PrismaService } from '../common'

export type ConditionType = 'wearing' | 'steps' | 'balance' | 'health' | 'whitelist' | 'invited'

@Injectable()
export class GroupService {
  constructor(
    private ethers: EthersService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) { }

  async lists(params: Prisma.GroupFindManyArgs) {
    return this.prisma.group.findMany(params)
      .then(
        groups => groups.map(async group => Object.assign(group, {
          members: await this.prisma.user.count({ where: { group: group.id } }),
          attributes: group.attributes.split(','),
        })),
      )
      .then(groups => Promise.all(groups))
  }

  async detail(where: Prisma.GroupWhereUniqueInput) {
    const detail = await this.prisma.group.findUnique({ where })

    const members = await this.prisma.user.count({ where: { group: where.id } })
    return {
      ...detail,
      attributes: detail?.attributes?.split(','),
      members,
    }
  }

  async members(params: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(params)
      .then(members => members.map(async (member) => {
        const length = await this.prisma.bloodOxygen.count({ where: { sncode: member.device } })
        return Object.assign(member, { wearing: length * 1800 })
      }))
      .then(members => Promise.all(members))
      .then(members => members.sort((a, b) => b.wearing - a.wearing))
  }

  async condition(type: ConditionType, sender: string) {
    if (type === 'whitelist')
      return defaultAddresses.whites.map(address => address.toLowerCase()).includes(sender.toLowerCase())
    if (type === 'balance') {
      const balance = await this.ethers.provider.getBalance(sender)
      return balance > 25000n * (10n ** 18n)
    }

    if (type === 'health') {
      const balance = await this.ethers.Health.balanceOf(sender)
      return balance > 10000n * (10n ** 18n)
    }

    if (type === 'invited') {
      const topic = this.ethers.Savings.filters.Deposited(undefined, sender)
      const depositedEvents = await this.ethers.Savings.queryFilter(topic)
      return !!depositedEvents.length
    }

    const sncode = await this.ethers.DoitRingDevice.getDeviceInAddress(sender)

    if (!sncode)
      return false

    if (type === 'wearing') {
      const count = await this.prisma.bloodOxygen.count({
        orderBy: { date: 'desc' },
        where: { sncode },
      })
      const wearingTime = count * 1000
      return wearingTime >= 2592000000
    }

    if (type === 'steps') {
      const { _sum: { value: steps = 0 } } = await this.prisma.step.aggregate({
        _sum: { value: true },
        where: { sncode },
      })
      return steps > 1000000
    }
  }

  async conditions(sender: string) {
    return {
      whitelist: await this.condition('whitelist', sender),
      wearing: await this.condition('wearing', sender),
      balance: await this.condition('balance', sender),
      invited: await this.condition('invited', sender),
      health: await this.condition('health', sender),
      steps: await this.condition('steps', sender),
    }
  }
}
