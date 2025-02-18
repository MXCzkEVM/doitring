import { proxy } from 'valtio'
import { storeToState } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { RingNFT, helperGetNFTs } from '@/service'

export const store = proxy({
  nfts: [] as RingNFT[],
  loading: false,
})

export function useProxyNFTs() {
  const { address } = useAccount()

  const [loading, setLoading] = storeToState(store, 'loading')
  const [nfts, setNFTs] = storeToState(store, 'nfts')

  async function request() {
    setLoading(true)
    const nfts = await helperGetNFTs({ address })
      .finally(() => setLoading(false))
    setNFTs(nfts)
    return nfts
  }
  function clear() {
    setNFTs([])
  }

  return [
    {
      value: nfts,
      loading,
    },
    request,
    clear,
  ] as const
}
