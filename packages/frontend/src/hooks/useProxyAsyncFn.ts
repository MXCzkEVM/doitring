import { useMount } from 'react-use'
import { FunctionReturningPromise, PromiseType } from 'react-use/lib/misc/types'
import { proxy, useSnapshot } from 'valtio'

interface AsyncFnCall<V = any> {
  promise?: Promise<V>
  loading: boolean
  value: V
  error?: any
}

export const caches = proxy<Record<string, AsyncFnCall>>({})

export interface UseProxyAsyncFnOptions {
  cache?: boolean
}

export function useProxyAsyncFn<T extends FunctionReturningPromise>(key: string, fn: T, options: UseProxyAsyncFnOptions = {}) {
  const snapshot = useSnapshot(caches)

  function run(...args: any[]) {
    const cache = caches[key]
    if (cache.promise)
      return cache.promise
    const result = fn(...args)
    if (result instanceof Promise) {
      cache.loading = true
      cache.promise = result
      result
        .then((value) => {
          // eslint-disable-next-line ts/no-unused-expressions
          options.cache && localStorage.setItem(key, value)
          cache.value = value
        })
        .catch(error => cache.error = error)
        .finally(() => cache.loading = false)
    }
    else {
      cache.promise = Promise.resolve(result)
      cache.value = result
    }
    cache.promise.finally(() => cache.promise = undefined)
    return cache.promise
  }

  useMount(() => {
    if (snapshot[key])
      return
    caches[key] = {
      value: options.cache ? localStorage.getItem(key) : undefined,
      loading: false,
      error: undefined,
    }
  })
  return [caches[key] as AsyncFnCall<PromiseType<ReturnType<T>>>, run as T] as const
}

useProxyAsyncFn.caches = caches
