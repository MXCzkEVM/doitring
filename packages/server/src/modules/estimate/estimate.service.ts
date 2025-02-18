import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { Group, Prisma, Season, User } from '@prisma/client'
import duration, { DurationUnitsObjectType } from 'dayjs/plugin/duration'
import BigNumber from 'bignumber.js'
import { parseEther } from 'ethers'
import { defu } from 'defu'
import { bold, cyan, reset, white, yellow } from 'chalk'
import { ratings } from '@doitring/analyzkit'
import { EthersService, PrismaService } from '../common'
import { RingService } from '../ring'
import { SeasonService } from '../season'
import { levels } from '../../config'
import { queryRingManys } from './query'
import { riposte } from './utils'

dayjs.extend(duration)
export interface UserInPoint extends User {
  locked: bigint
}

export interface MemberInPoint extends User {
  locked: bigint
}

@Injectable()
export class EstimateService {
  constructor(
    private ethers: EthersService,
    private prisma: PrismaService,
    private season: SeasonService,
    private ring: RingService,
  ) {}

  private readonly logger = new Logger('Estimate')

  async runs() {
    console.log()
    this.println('calculation', ['starting on', bold(dayjs().format())])

    const users: UserInPoint[] = await this.pointByUsers()
    const groups = await this.prisma.group.findMany()

    await this.pointByGroupsBonuses(groups, users)

    await this.ensureSeasons(groups)

    await this.ensureMembers(groups, users)

    const unpoint = await this.season.seasons(Date.now())
    const members = await this.pointByMembers(unpoint, users)
    const seasons = await this.pointBySeasons(unpoint, users)

    for (const { group, score, rank } of seasons) {
      this.println('season', [
        yellow(`group#${group}`),
        'rating is score as',
        cyan(score),
        'points',
        'and ranks',
        cyan(rank),
      ])
    }

    for (const { address, score, group, rank } of members) {
      this.println('user', [
        yellow(address.slice(0, 8)),
        'rating is score as',
        cyan(score),
        'points',
        'ranks',
        cyan(rank),
        'in',
        yellow(`group#${group}`),
      ])
    }

    return {
      processes: await this.pointByTrans(seasons, members, groups, users),
      onComplete: () => {
        this.println('calculation', [
          'ending at',
          bold(dayjs().format()),
        ])
        console.log()
      },
    }
  }

  // 分数统计时间 - 凌晨 0 点，统计昨天数据
  // --- 签到分数 ---
  // 1. 佩戴时间（16 小时满分）
  // 2. 睡眠、步数、血氧、心率

  // --- 锁仓加成（Boost） ---
  // Boost = 锁仓数量 * 锁仓时长系数
  // 1枚=105% | 10枚=110% | 30枚=115% | 100枚=120% | 1000枚=150%
  // 1w=110% | 1m=120% | 3m=130% | 1y=150% | 2y=200%
  // 数量倍率 * (count / 1000) * 时间倍率

  // --- 分组加成 ---
  // 创建者：每月获得 Group 总算力 10% 作为奖励（？）
  // 高级：成员每日获得 10%  算力 Boost
  // 中级：成员每日获得 5%   算力 Boost
  // 初级：成员每日获得 2.5% 算力 Boost

  // --- 分数（分数） ---
  // 签到分数 * (锁仓数量 * 时长系数) * Group 奖励

  // 3 个指环（120、130、200）
  // 450 * 0.1 = 45
  // 45%

  // 800 * 1.1 * 1.45

  async pointByUsers() {
    const datas = await queryRingManys(this.ring)

    const calcUserPoints = async (user: User) => {
      if (!user.device)
        return
      const oxygens = datas.oxygens.filter(s => s.sncode === user.device)
      const sleeps = datas.sleeps.filter(s => s.sncode === user.device)
      const steps = datas.steps.filter(s => s.sncode === user.device)
      const rates = datas.rates.filter(s => s.sncode === user.device)

      const scores = {
        wearing: riposte(
          [oxygens.length * 1800 >= (16 * 3600), 100],
          [oxygens.length * 1800 >= (8 * 3600), 90],
          [oxygens.length * 1800 >= (4 * 3600), 80],
          [oxygens.length * 1800 >= (2 * 3600), 60],
          [oxygens.length * 1800 >= (1 * 3600), 30],
          [true, 0],
        )!,
        sleep: ratings.sleeps(sleeps).score,
        step: ratings.steps(steps).score,
        oxygen: ratings.oxygens(oxygens).score,
        rate: ratings.rates(rates).score,
      }

      const points = {
        sleep: scores.sleep * 0.3,
        step: scores.step * 0.3,
        wearing: scores.wearing * 0.2,
        rate: scores.rate * 0.1,
        oxygen: scores.oxygen * 0.1,
      }

      const multiplyByHealth = Object.values(points).reduce((a, b) => a + b, 0)
      const stakes = await this.ethers.DoitRingStaked.stakes(user.owner)

      const locked = stakes.reduce((t, v) => v.amount + t, 0n)
      const multiplyByToken = await this.bonusInStakesByOwner(user.owner)
        .then(bonus => bonus / 100)
      const score = new BigNumber(multiplyByHealth)
        .multipliedBy(1 + multiplyByToken)
        .toFixed(0)

      user.pointInBasic = multiplyByHealth
      user.bonusInToken = +(multiplyByToken * 100).toFixed(0)
      user.pointInJsons = JSON.stringify(points)

      return {
        bonusInGroup: 0,
        ...user,
        device: user.device!,
        score: Number(score),
        locked,
      }
    }

    return this.prisma.user.findMany()
      .then(users => users.map(calcUserPoints))
      .then(users => users.filter(Boolean))
      .then(processes => Promise.all(processes))
  }

  async bonusInStakesByOwner(owner: string) {
    const stakes = await this.ethers.DoitRingStaked.stakes(owner)
    const multiplys = stakes.map((stake) => {
      const quantity = riposte(
        [stake.amount > 1n * 10n ** 18n, 0.05],
        [stake.amount > 10n * 10n ** 18n, 0.1],
        [stake.amount > 30n * 10n ** 18n, 0.15],
        [stake.amount > 100n * 10n ** 18n, 0.2],
        [stake.amount > 1000n * 10n ** 18n, 0.5],
        [true, 0],
      )
      const timestamp = stake.timestamp
      const current = dayjs().unix()
      const duration = riposte(
        [current > (timestamp + d2s({ weeks: 1 })), 0.1],
        [current > (timestamp + d2s({ months: 1 })), 0.2],
        [current > (timestamp + d2s({ months: 3 })), 0.3],
        [current > (timestamp + d2s({ years: 1 })), 0.5],
        [current > (timestamp + d2s({ years: 2 })), 1],
        [true, 0],
      )
      const multiplyTime = Number(stake.amount)
        / (1000 * 10 ** 18) * duration
      return quantity + multiplyTime
    })
    const mul = Math.min(multiplys.reduce((t, v) => t + v, 0), 1.5)
    return +(mul * 100).toFixed(0)
  }

  async pointByGroupsBonuses(groups: Group[], users: UserInPoint[] = []) {
    const processes = groups.map(async (group) => {
      const members = users.filter(u => u.group === group.id)

      const lastOfLastMonth = dayjs().subtract(1, 'month').endOf('month')
      const fastOfLastMonth = dayjs().subtract(1, 'month').startOf('month')

      const last = await this.prisma.season.findFirst({
        where: {
          group: group.id,
          timestamp: {
            gte: new Date(fastOfLastMonth.valueOf()),
            lte: new Date(lastOfLastMonth.valueOf()),
          },
        },
      })

      if (!last)
        return

      // 高级：3000000 算力
      // 中级：600000 算力
      // 高级Group：成员上限500；每日总算力超过100,000，Group总锁仓超过1,000,000枚$Blueberry
      // 中级Group：成员上限200；每日总算力超过20,000，Group总锁仓超过100,000枚$Blueberry
      // 初级Group：成员上限50；满足初始条件。

      // 高级：成员每日获得 10%  算力 Boost
      // 中级：成员每日获得 5%   算力 Boost
      // 初级：成员每日获得 2.5% 算力 Boost

      const health = BigInt(last.locked.toString())
      const points = last.score

      group.level = riposte(
        [points > levels[3].points && health > levels[3].health, 3],
        [points > levels[2].points && health > levels[2].health, 2],
        [true, 1],
      )!

      const locked = BigInt(last.locked.toString())
      const multiplyByGroup = riposte(
        [last.score > 3000000 && locked > parseEther('1000000'), 0.1],
        [last.score > 600000 && locked > parseEther('100000'), 0.05],
        [true, 0.025],
      )
      for (const member of members) {
        member.score = +new BigNumber(member.score)
          .multipliedBy(1 + multiplyByGroup)
          .toFixed(0)
        member.bonusInGroup = +(multiplyByGroup * 100).toFixed()
      }
    })
    await Promise.all(processes)
  }

  async ensureSeasons(groups: Group[]) {
    const processes = groups.map(async (group) => {
      const season = await this.season.season(Date.now(), {
        where: { group: group.id },
      })

      if (season)
        return

      this.println('group', [
        white(`${group.name} #${group.id}`),
        'has create',
        yellow(dayjs().format('YYYY-MM')),
        'season',
      ])

      return this.prisma.season.create({
        data: {
          group: group.id,
          timestamp: new Date(),
        },
      })
    })

    return Promise.all(processes)
  }

  async ensureMembers(groups: Group[], users: UserInPoint[]) {
    const processes = groups.map(async (group) => {
      const season = await this.season.season(Date.now(), {
        where: { group: group.id },
      })
      const members = users.filter(u => u.group === season.group)
      return members.map(async (member) => {
        const exists = await this.season.someMember({
          address: member.owner,
          season: season.id,
        })

        if (exists)
          return

        this.println('season', [
          white(`${group.name} #${group.id}`),
          'has create',
          yellow(member.owner.slice(0, 12)),
          'member',
        ])

        return this.prisma.member.create({
          data: {
            address: member.owner,
            device: member.device,
            season: season.id,
            avatar: member.avatar,
            nickname: member.nickname,
          },
        })
      })
    })
    const memberProcesses = await Promise.all(processes)
      .then(g => g.flatMap(ms => ms).filter(Boolean))
    return Promise.all(memberProcesses)
  }

  // 高级Group：成员上限500；每日总算力超过100,000，Group总锁仓超过1,000,000枚$Blueberry
  // 中级Group：成员上限200；每日总算力超过20,000，Group总锁仓超过100,000枚$Blueberry
  // 初级Group：成员上限50；满足初始条件。

  // 每月 1 号统计上月赛季情况
  // 每天晚上同步赛季信息

  // 高级：3000000 算力 & 1000000 枚 Health
  // 中级：600000 算力 & 100000 枚 Health

  async pointByMembers(seasons: Season[], users: UserInPoint[]) {
    const processes = seasons.map(async (season) => {
      const members = await this.season.members({ season: season.id })
      return members.map(async (m) => {
        const user = users.find(u => u.owner === m.address)
        if (!user)
          return
        return Object.assign(m, {
          balance: user.locked,
          score: user.score,
          group: user.group,
        })
      })
    })

    const members = await Promise.all(processes)
      .then(ms => ms.flatMap(m => m))
      .then(ms => Promise.all(ms))
      .then(ms => ms.filter(Boolean))

    return members
      .sort((a, b) => a.balance < b.balance ? -1 : 1)
      .map((m, mRank) => defu(m, { mRank }))
      .sort((a, b) => b.score - a.score)
      .map((m, sRank) => defu(m, { sRank }))
      .map(m => defu(m, { tRank: m.sRank + m.mRank }))
      .sort((a, b) => a.tRank - b.tRank)
      .map((m, rank) => ({ ...m, rank: rank + 1 }))
  }

  async pointBySeasons(seasons: Season[], users: MemberInPoint[]) {
    return seasons.map((season) => {
      const members = users.filter(u => u.group === season.group)
      const locked = members.reduce((prev, curr) => prev + curr.locked, 0n)
      const score = members.reduce((prev, curr) => prev + curr.score, 0)
      return {
        ...season,
        locked: locked.toString(),
        score,
      }
    })
      .sort((a, b) => a.locked < b.locked ? -1 : 1)
      .map((m, mRank) => defu(m, { mRank }))
      .sort((a, b) => b.score - a.score)
      .map((m, sRank) => defu(m, { sRank }))
      .map(m => defu(m, { tRank: m.sRank + m.mRank }))
      .sort((a, b) => a.tRank - b.tRank)
      .map((m, rank) => ({ ...m, rank: rank + 1 }))
  }

  async pointByTrans(
    seasons: any[],
    members: any[],
    groups: any[],
    users: any[],
  ) {
    const rows: Prisma.PrismaPromise<any>[] = [
      ...users.map(user => this.prisma.user.update({
        data: {
          bonusInGroup: user?.bonusInGroup || 0,
          bonusInToken: user?.bonusInToken || 0,
          pointInBasic: user?.pointInBasic || 0,
          pointInJsons: user?.pointInJsons || '{}',
          score: user?.score || 0,
        },
        where: { owner: user.owner },
      })),
      ...groups.map(group => this.prisma.group.update({
        data: { level: group.level },
        where: { id: +group.id },
      })),
      ...members.map(member => this.prisma.member.update({
        data: { score: member.score, rank: member.rank },
        where: { id: +member.id },
      })),
      ...seasons.map(season => this.prisma.season.update({
        data: { locked: season.locked, score: season.score, rank: season.rank },
        where: { id: +season.id },
      })),
    ]
    return rows
  }

  println(type: string, messages: string[]) {
    this.logger.log(reset(`${white(`[${type}]`)} - ${messages.join(' ')}`))
  }
}

function d2s(units: DurationUnitsObjectType) {
  return BigInt(dayjs.duration(units).seconds())
}
