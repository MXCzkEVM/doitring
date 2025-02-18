import { useAsync } from 'react-use'
import { getGroupCondition } from '@/api'

export function useGroupConds(address: string) {
  const { value: balance = false, loading: l1 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'balance', address }).then(d => d.data),
    [address],
  )
  const { value: wearing = false, loading: l2 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'wearing', address }).then(d => d.data),
    [address],
  )
  const { value: steps = false, loading: l3 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'steps', address }).then(d => d.data),
    [address],
  )
  const { value: health = false, loading: l4 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'health', address }).then(d => d.data),
    [address],
  )
  const { value: whitelist = false, loading: l5 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'whitelist', address }).then(d => d.data),
    [address],
  )
  const { value: invited = false, loading: l6 } = useAsync(
    (): Promise<boolean> => getGroupCondition({ type: 'invited', address }).then(d => d.data),
    [address],
  )

  return {
    values: {
      balance,
      wearing,
      steps,
      health,
      whitelist,
      invited,
    },
    loadings: {
      balance: l1,
      wearing: l2,
      steps: l3,
      health: l4,
      whitelist: l5,
      invited: l6,
    },
  }
}
