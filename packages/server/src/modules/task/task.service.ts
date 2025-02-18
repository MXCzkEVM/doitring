import { Injectable, Logger } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { cyan, gray, reset } from 'chalk'
import dayjs from 'dayjs'
import { $ } from 'zx'
import fs from 'fs-extra'
import { EthersService, PrismaService } from '../common'
import { EventsService } from '../events'
import { EstimateService } from '../estimate'
import { getIndexerLastBlock, setIndexerLastBlock } from './utils'

@Injectable()
export class TaskService {
  private readonly logger = new Logger('Task')
  private locked = false

  constructor(
    private ethers: EthersService,
    private prisma: PrismaService,
    private estimate: EstimateService,
    private events: EventsService,
  ) { }

  @Interval(3000)
  async indexer() {
    if (this.locked)
      return

    const unlock = () => this.locked = false
    const timer = setTimeout(unlock, 1800000)

    try {
      this.locked = true
      await this.processIndexer()
      this.locked = false
      clearTimeout(timer)
    }
    catch (error) {
      console.log(error)
      this.logger.warn(error.message)
      this.locked = false
      clearTimeout(timer)
    }
  }


  @Cron('0 0 * * *')
  async processDoitRingScore() {
    const { processes, onComplete } = await this.estimate.runs()
    await this.prisma.$transaction(processes)
    onComplete()
  }

  async processIndexer() {
    const lastBlockNumber = await this.ethers.provider.getBlockNumber()
    const startBlockNumber = await getIndexerLastBlock()
    const endBlockNumber = Math.min(startBlockNumber + 5, lastBlockNumber)

    if (startBlockNumber > endBlockNumber) {
      this.locked = false
      return
    }

    await this.printlnBeforeParseArange(startBlockNumber, endBlockNumber)
    await this.processDoitRingBinded(startBlockNumber, endBlockNumber)
    await this.processDoitRingFriendCreate(startBlockNumber, endBlockNumber)
    await this.processDoitRingFriendJoin(startBlockNumber, endBlockNumber)
    await this.processDoitRingClaimed(startBlockNumber, endBlockNumber)
    await this.processUserSupplementary(startBlockNumber, endBlockNumber)

    await setIndexerLastBlock(endBlockNumber + 1)
    this.locked = false
  }

  async processDoitRingClaimed(start: number, end: number) {
    const target = this.ethers.DoitRingDevice.filters.Claimed()
    const events = await this.ethers.DoitRingDevice.queryFilter(target, start, end)
    await Promise.allSettled(events.map(this.events.Claimed.bind(this.events)))
  }

  async processDoitRingRegistered(start: number, end: number) {
    const target = this.ethers.DoitRingDevice.filters.Registered()
    const events = await this.ethers.DoitRingDevice.queryFilter(target, start, end)
    await Promise.all(events.map(this.events.Registered.bind(this.events)))
  }

  async processDoitRingBinded(start: number, end: number) {
    const target = this.ethers.DoitRingDevice.filters.Binded()
    const events = await this.ethers.DoitRingDevice.queryFilter(target, start, end)
    await Promise.all(events.map(this.events.Binded.bind(this.events)))
  }

  async processDoitRingFriendJoin(start: number, end: number) {
    const target = this.ethers.DoitRingFriend.filters.GroupJoined()
    const events = await this.ethers.DoitRingFriend.queryFilter(target, start, end)
    await Promise.all(events.map(this.events.GroupJoined.bind(this.events)))
  }

  async processDoitRingFriendCreate(start: number, end: number) {
    const target = this.ethers.DoitRingFriend.filters.GroupCreated()
    const events = await this.ethers.DoitRingFriend.queryFilter(target, start, end)
    await Promise.all(events.map(this.events.GroupCreated.bind(this.events)))
  }

  async processUserSupplementary(start: number, end: number) {
    const target = this.ethers.Storage.filters.StorageUpdated()
    const events = await this.ethers.Storage.queryFilter(target, start, end)
    await Promise.all(events.map(this.events.StorageUpdated.bind(this.events)))
  }

  async printlnBeforeParseArange(start: number, end: number) {
    const titleLogText = `${reset.underline('[scan]')} ${gray('- regularly scan blockchain')}`
    const rangeLogText = start !== end
      ? `${cyan(`${start} ${gray('to')} ${end}`)} ${gray('blocks')}`
      : `${cyan(start)} ${gray('block')}`
    this.logger.log(`${titleLogText} ${rangeLogText}`)
  }
}
