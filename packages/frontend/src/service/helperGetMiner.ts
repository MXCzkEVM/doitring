import { BigNumberish } from 'ethers'
import { defaultAddresses as addresses, contracts } from '@harsta/client'

export interface GetMinerQuery {
  address: string
}

export async function helperGetMiner(query: GetMinerQuery) {
  const DoitRingDevice = contracts.DoitRingDevice.resolve()
  const DoitRingFriend = contracts.DoitRingFriend.resolve()
  const [mapping, group] = await Promise.all([
    DoitRingDevice.getTokenInAddress(query.address),
    DoitRingFriend.group(query.address),
  ])

  if (mapping.token === addresses.ZERO)
    return undefined

  const [owner, sncode] = await Promise.all([
    ownerOf(mapping.token, mapping.tokenId),
    gsncode(mapping.token, mapping.tokenId),
  ])
  if (owner !== query.address)
    return undefined
  async function ownerOf(token: string, tokenId: BigNumberish) {
    const contract = {
      [addresses.DoitRingNFT as string]: contracts.ERC721.attach(addresses.DoitRingNFT),
      [addresses.DoitRingNFTLimit]: contracts.ERC721.attach(addresses.DoitRingNFTLimit),
    }
    return contract[token].ownerOf(tokenId).catch(() => addresses.ZERO)
  }

  async function gsncode(token: string, tokenId: BigNumberish) {
    return DoitRingDevice.getDeviceInToken(token, tokenId).then(v => v.sncode)
  }

  return {
    tokenId: Number(mapping.tokenId),
    token: mapping.token,
    name: mapping.token === addresses.DoitRingNFTLimit
      ? `Launchpad #${sncode.replace('2301A', 'Blueberry')}`
      : `#${sncode.replace('2301A', 'Blueberry')}`,
    group: Number(group) || undefined,
    owner,
    sncode,
  }
}
