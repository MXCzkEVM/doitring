import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { getAddress } from 'ethers'
import { Prisma } from '@prisma/client'
import { EthersService, PrismaService } from '../common'

@Injectable()
export class UserService {
  constructor(
    private ethers: EthersService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) { }

  async ensure(address: string) {
    const count = await this.prisma.user.count({
      where: { owner: getAddress(address) },
    })
    if (count > 0)
      return
    await this.prisma.user.create({
      data: { owner: getAddress(address) },
    })
  }

  async detail(address: string) {
    return this.prisma.user.findUnique({ where: { owner: getAddress(address) } })
  }

  async sorceTotal(where?: Prisma.UserWhereInput) {
    const { _sum: { score = 0 } } = await this.prisma.user.aggregate({
      _sum: { score: true },
      where,
    })
    return score
  }
}
