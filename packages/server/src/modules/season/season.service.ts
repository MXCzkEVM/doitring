import dayjs from 'dayjs'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { defu } from 'defu'
import { EthersService, PrismaService } from '../common'
import { riposte } from '../estimate/utils'
import { levels } from '../../config'

@Injectable()
export class SeasonService {
  constructor(
    private prisma: PrismaService,
    private ethers: EthersService,
  ) { }

  season(time: string | number, params: Prisma.SeasonFindFirstArgs = {}) {
    const fastMonth = dayjs(time).startOf('month')
    const lastMonth = dayjs(time).endOf('month')

    const config = defu(params, {
      where: {
        timestamp: {
          gte: new Date(fastMonth.valueOf()),
          lte: new Date(lastMonth.valueOf()),
        },
      },
    })
    return this.prisma.season.findFirst(config)
  }

  seasons(time: string | number, params: Prisma.SeasonFindManyArgs = {}) {
    const fastMonth = dayjs(time).startOf('month')
    const lastMonth = dayjs(time).endOf('month')

    return this.prisma.season.findMany(defu(params, {
      where: {
        timestamp: {
          gte: new Date(fastMonth.valueOf()),
          lte: new Date(lastMonth.valueOf()),
        },
      },
    }))
  }

  member(where: Prisma.MemberWhereInput) {
    return this.prisma.member.findFirst({ where })
  }

  async level(owner: string) {
    const groupBignum = await this.ethers.DoitRingFriend.group(owner)
    const group = Number(groupBignum) || undefined
    if (!group)
      return 0

    const date = dayjs().subtract(1, 'M').toString()
    const season = await this.season(date, { where: { group } })

    if (!season)
      return 1

    const health = BigInt(season.locked.toString())
    const points = season.score

    const level = riposte(
      [points > levels[3].points && health > levels[3].health, 3],
      [points > levels[2].points && health > levels[2].health, 2],
      [true, 1],
    )

    return level
  }

  members(where: Prisma.MemberWhereInput = {}) {
    return this.prisma.member.findMany({ where })
  }

  async someMember(where: Prisma.MemberWhereInput) {
    const count = await this.prisma.member.count({ where })
    return count > 0
  }

  async someSeason(where: Prisma.MemberWhereInput) {
    const count = await this.prisma.member.count({ where })
    return count > 0
  }
}
