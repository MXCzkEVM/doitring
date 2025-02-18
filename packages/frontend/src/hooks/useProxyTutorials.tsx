import { useSnapshot } from 'valtio'
import { store } from '@/store'

export function useProxyTutorials() {
  const tutorials = useSnapshot(store.tutorials)

  function confirm(type: keyof typeof tutorials) {
    store.tutorials[type] = true
  }

  return [tutorials, confirm] as const
}
