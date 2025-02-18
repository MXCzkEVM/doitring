import { contracts } from '@harsta/client'
import { Miner } from '@/store'

export async function helperGetClaims({ miner }: { miner: Miner }) {
  const DoitRingDevice = contracts.DoitRingDevice.resolve()
  const filter = DoitRingDevice.filters.Claimed(miner.token, miner.tokenId)
  const events = await DoitRingDevice.queryFilter(filter)
  const claims = events.map(event => ({
    uid: event.args.uid,
    timestamp: Number(event.args.timestamp),
    tokenId: Number(event.args.tokenId),
    hash: event.transactionHash,
    token: event.args.token,
    rewards: event.args.rewards,
    memo: event.args.memo,
  }))
  return claims
}
