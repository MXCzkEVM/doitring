import { useAsyncFn } from 'react-use'
import { contracts } from '@harsta/client'
import { useProxyMiner } from '@/hooks'
import { whenever } from '@/utils'

export function useProxyTotal() {
  const [{ value: miner }] = useProxyMiner()
  const storage = contracts.Storage.resolve()

  const [{ value: total = 10000n }, fetch] = useAsyncFn(
    async () => {
      const total = await whenever(
        miner,
        () => storage.getItem(`ring_${miner!.sncode}`, 'steps'),
      )
      return total ? BigInt(total) : 10000n
    },
    [miner],
  )
  return [total, fetch] as const
}
