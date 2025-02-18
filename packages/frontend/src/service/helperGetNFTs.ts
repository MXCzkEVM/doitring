import { contracts, defaultAddresses } from '@harsta/client'

export interface GetNFTsQuery {
  address?: string
}

export interface RingNFT {
  contract: string
  exist: boolean
  uri: string
  id: number
  owner: string
  name: string
}

export async function helperGetNFTs({ address }: GetNFTsQuery): Promise<RingNFT[]> {
  const DoitRingDevice = contracts.DoitRingDevice.resolve()

  if (!address)
    return []

  async function allOwnerNFTs(contract: string) {
    const erc721 = contracts.DoitRingNFT.attach(contract)

    const total = await erc721.totalSupply()
    const numbers = arange(0, Number(total))
    const owners = await Promise.all(numbers.map(ownerOf))

    async function ownerOf(i: number) {
      return erc721.ownerOf(i).catch(() => defaultAddresses.ZERO)
    }
    async function exists(i: number) {
      return DoitRingDevice.existsBinded(contract, i).catch(() => false)
    }
    async function tokenURI(i: number) {
      return erc721.tokenURI(i).catch(() => '')
    }

    const nfts = numbers
      .map(i => ({ id: i, owner: owners[i] }))
      .filter(o => o.owner !== defaultAddresses.ZERO)

    const [uris, registers] = await Promise.all([
      Promise.all(nfts.map(n => tokenURI(n.id))),
      Promise.all(nfts.map(n => exists(n.id))),
    ])

    return nfts
      .map((nft, i) => ({
        contract,
        exist: registers[i],
        uri: uris[i],
        ...nft,
        name: contract === defaultAddresses.DoitRingNFTLimit
          ? `Launchpad #${generateFixedRandomNumber(nft.id)}`
          : `#${generateFixedRandomNumber(nft.id)}`,
      }))
      .filter(n => n.owner === address)
  }

  const nftContracts = [
    defaultAddresses.DoitRingNFTLimit,
    defaultAddresses.DoitRingNFT,
  ]
  return Promise.all(nftContracts.map(allOwnerNFTs))
    .then(ns => ns.flatMap(ns => ns))
}

function arange(x1: number, x2?: number, stp = 1, z: number[] = [], z0 = z.length) {
  if (!x2)
    x1 -= x2 = x1
  for (let z1 = z0 + Math.max(Math.ceil((++x2 - x1) / stp), 0); z0 < z1; x1 += stp) z[z0++] = x1
  return z
}

function generateFixedRandomNumber(input: any) {
  input = input.toString()

  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }

  const min = 0
  const max = Infinity
  const fixedRandomNumber = (Math.abs(hash) % (max - min + 1)) + min

  return fixedRandomNumber
}
