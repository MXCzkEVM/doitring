import { delay } from './util'

export interface LoopFn<T> {
  (next: (ms: number) => Promise<T>): Promise<T>
}

export function loop<T = void>(fn: LoopFn<T>) {
  async function next(ms: number) {
    await delay(ms)
    return fn(next)
  }
  return fn(next)
}
