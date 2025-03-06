import { useAccount } from 'wagmi'
import { useWhenever } from '@hairy/react-utils'
import { useWheneverAsync } from './useWheneverAsync'
import { getSignClaimIntel } from '@/api'

export function useRequestIntel() {
  const { address } = useAccount()

  const state = useWheneverAsync(
    address,
    sender => getSignClaimIntel({ sender }),
    [address],
  )

  useWhenever(address, state[1], { immediate: true })
  return state
}
