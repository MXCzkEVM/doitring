import { useAccount } from 'wagmi'
import { storeToStates } from './storeToStates'
import { store } from '@/store'
import { getUserAddress } from '@/api'

export function useProxyUser() {
  const {
    detail: [detail, setDetail],
    loading: [loading, setLoading],
  } = storeToStates(store.user)

  const { address } = useAccount()

  async function request() {
    if (!address)
      return
    setLoading(true)
    const detail = await getUserAddress({ address })
      .finally(() => setLoading(false))
    setDetail(detail.data)
  }
  const clear = () => setDetail(undefined)
  return [{ value: detail, loading }, request, clear] as const
}
