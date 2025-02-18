import { Controller, Get, Post, Query } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { defaultAddresses as addresses, defaultChain as chain, contracts } from '@harsta/client'
import { AbiCoder, getAddress, keccak256, parseEther, solidityPackedKeccak256, toBeArray } from 'ethers'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'
import { EthersService, PrismaService } from '../common'
import { UserService } from '../user'
import { GroupService } from '../group'
import { storage } from '../../storage'
import { riposte } from '../task/estimate'
import { SeasonService } from '../season'
import { SignService } from './sign.service'
import { ClaimIntelResponse, ClaimSignatureResponse, SignatureResponse } from './dtos'
import { NumberEncryptor } from './utils'
import { Reward } from './entities'

const abiCoder = AbiCoder.defaultAbiCoder()

@ApiTags('Sign')
@Controller('sign')
@ApiExtraModels(Reward)
export class SignController {
  constructor(
    private readonly ethers: EthersService,
    private readonly service: SignService,
    private readonly group: GroupService,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private readonly season: SeasonService,
  ) {}

  @Get('claim/intel')
  @ApiQuery({ name: 'sender', type: 'string' })
  @ApiResponse({ type: ClaimIntelResponse })
  async claimByIntel(@Query('sender') sender: string) {
    sender = getAddress(sender)

    const sncode = await this.ethers.DoitRingDevice.getDeviceInAddress(sender)
    const mapping = await this.ethers.DoitRingDevice.getTokenInDevice(sncode)
    const level = await this.season.level(sender)

    const claims = riposte(
      [sender === '0x0795D90c6d60F7c77041862E9aE5059B4d5e0d7A', 1000],
      [level === 0, 1],
      [level === 1, 2],
      [level === 2, 3],
      [level === 3, 6],
    )

    const DoitRingNFT = contracts.DoitRingNFT.attach(mapping.token)
    if (mapping.token === addresses.ZERO)
      return { statusCode: 403, message: 'not token' }
    if (await DoitRingNFT.ownerOf(mapping.tokenId) !== sender)
      return { statusCode: 403, message: 'not nft owner' }

    const user = await this.user.detail(sender)
    const total = await this.user.sorceTotal()
    const score = user.score || 0

    const day = dayjs().format('YYYYMMDD')
    const prefix = `uid:device:${sncode}:${day}`

    let claimed = await storage.getItem<number>(prefix) || 0

    const target = this.ethers.DoitRingDevice.filters.Claimed(
      mapping.token,
      mapping.tokenId,
    )
    const events = await this.ethers.DoitRingDevice.queryFilter(target)
    while (events.find(event => event.args.uid === `${prefix}:${claimed}`)) {
      claimed += 1
    }
    claimed = Math.min(claimed, claims)

    const rewards = {
      [addresses.DoitRingNFT]: parseEther('800').toString(),
      [addresses.DoitRingNFTLimit]: parseEther('1600').toString(),
    }
    let amount = '0'

    if (claimed === 0) {
      const reward = rewards[mapping.token] || 0
      const multiply = new BigNumber(score).dividedBy(total)
      const amt = new BigNumber(reward).multipliedBy(multiply)
      amount = fixnum(amt)
    }

    return {
      storage: prefix,
      uid: `${prefix}:${claimed}`,
      claims,
      claimed,
      amount,
      sncode,
      level,
      day,
    }
  }

  @Get('claim')
  @ApiQuery({ name: 'sender', type: 'string' })
  @ApiResponse({ type: ClaimSignatureResponse })
  async claim(@Query('sender') sender: string) {
    if (!sender)
      return { statusCode: 400, message: 'not sender' }

    sender = getAddress(sender)

    const intel = await this.claimByIntel(sender)

    if (intel.statusCode)
      return intel

    if (intel.claimed === intel.claims)
      return { statusCode: 403, message: 'exceeding number of claims' }

    const redisKey = `${chain.id}_blueberry_signs`

    const rewards = [
      { token: addresses.Health, amount: intel.amount },
    ]

    const cache = await storage.getItem<string>(`${redisKey}/${intel.uid}`)
    if (cache)
      return { uid: intel.uid, signature: cache, rewards }

    const rewardsEncoded = abiCoder.encode(
      ['tuple(address token, uint256 amount)[]'],
      [rewards],
    )
    const rewardsHash = keccak256(rewardsEncoded)
    const messageHash = solidityPackedKeccak256(
      ['string', 'address', 'string', 'bytes32'],
      [intel.uid, sender, intel.sncode, rewardsHash],
    )
    const messageByte = toBeArray(messageHash)
    const signature = await this.ethers.verifier.signMessage(messageByte)

    await storage.setItem<string>(`${redisKey}/${intel.uid}`, signature)

    return { uid: intel.uid, signature, rewards }
  }

  @Post('claim/count')
  @ApiQuery({ name: 'uid', type: 'string' })
  @ApiResponse({ type: ClaimSignatureResponse })
  async claimCount(@Query('uid') uid: string) {
    const uids = uid.split(':')
    const claimed = +uids.splice(-1, 1)[0]
    await storage.setItem(uids.join(':'), claimed + 1)
    return { result: 1 }
  }

  @Get('group/claim')
  @ApiQuery({ name: 'sender', type: 'string' })
  @ApiQuery({ name: 'group', type: 'number' })
  @ApiResponse({ type: ClaimSignatureResponse })
  async groupClaim(
    @Query('sender') sender: string,
    @Query('group') group: number,
  ) {
    const sncode = await this.ethers.DoitRingDevice.getDeviceInAddress(sender)
    const owner = await this.ethers.DoitRingFriend.ownerOf(group)

    if (owner !== sender)
      return { statusCode: 403, message: 'Not group owner' }
    const score = await this.user.sorceTotal({ group: Number(group) })
    const total = await this.user.sorceTotal()

    const reward = parseEther('800').toString()
    const multiply = new BigNumber(score).dividedBy(total)
    const amount = new BigNumber(reward).multipliedBy(multiply)

    const redisKey = `${chain}_blueberry_signs`
    const month = dayjs().month(dayjs().month() - 1).format('YYYYMM')
    const uid = `uid:group:${group}:${month}`

    const rewards = [
      { token: addresses.Health, amount: fixnum(amount) },
    ]

    const cache = await storage.getItem<string>(`${redisKey}/${uid}`)
    if (cache)
      return { uid, signature: cache, rewards }

    const rewardsEncoded = abiCoder.encode(
      ['tuple(address token, uint256 amount)[]'],
      [rewards],
    )
    const rewardsHash = keccak256(rewardsEncoded)
    const messageHash = solidityPackedKeccak256(
      ['string', 'address', 'string', 'bytes32'],
      [uid, sender, sncode, rewardsHash],
    )
    const messageByte = toBeArray(messageHash)
    const signature = await this.ethers.verifier.signMessage(messageByte)

    await storage.setItem<string>(`${redisKey}/${uid}`, signature)

    return { uid, signature, rewards }
  }

  @Get('group/create')
  @ApiQuery({ name: 'sender', type: 'string' })
  @ApiQuery({ name: 'uri', type: 'string' })
  @ApiResponse({ type: SignatureResponse })
  async groupCreate(
    @Query('sender') sender: string,
    @Query('uri') uri: string,
  ) {
    const conditions = await this.group.conditions(sender).then(conds => [
      conds.balance && conds.health,
      conds.wearing && conds.steps,
      conds.whitelist,
      conds.invited,
    ])

    if (!conditions.some(cond => cond))
      return { statusCode: 403, message: 'Not meeting the conditions' }

    const messageHash = solidityPackedKeccak256(
      ['address', 'string'],
      [sender, uri],
    )
    const messageByte = toBeArray(messageHash)
    return {
      data: await this.ethers
        .verifier
        .signMessage(messageByte),
    }
  }

  @Get('group/join')
  @ApiQuery({ name: 'sender', type: 'string' })
  @ApiQuery({ name: 'invite', type: 'string', required: false })
  @ApiQuery({ name: 'group', type: 'number', required: false })
  @ApiResponse({ type: SignatureResponse })
  async groupJoin(
    @Query('sender') sender: string,
    @Query('invite') invite?: string,
    @Query('group') groupId?: number,
  ) {
    const device = await this.ethers.DoitRingDevice.getDeviceInAddress(sender)
    if (!device)
      throw new Error('User not registered')

    if (groupId && !invite) {
      const group = await this.prisma.group.findUnique({
        where: { id: +groupId },
      })
      if (!group.opening)
        throw new Error('The group is not open to the public')
    }

    if (!groupId && invite)
      groupId = NumberEncryptor.decrypt(invite)
    const messageHash = solidityPackedKeccak256(
      ['address', 'uint256'],
      [sender, groupId],
    )

    const messageByte = toBeArray(messageHash)
    return {
      data: await this.ethers
        .verifier
        .signMessage(messageByte),
    }
  }
}

function fixnum(num: BigNumber) {
  return num.toFixed(0) === 'NaN' ? '0' : num.toFixed(0)
}
