import { DependencyList } from 'react'
import { useAsyncFn } from 'react-use'

export function useWheneverAsync<T, F extends (value: NonNullable<T>) => Promise<any> >(
  source: T,
  fn: F,
  deps?: DependencyList,
) {
  return useAsyncFn(async () => source ? fn(source) : undefined, deps)
}
