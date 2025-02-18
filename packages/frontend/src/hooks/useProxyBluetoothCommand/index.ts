/* eslint-disable ts/ban-ts-comment */
import { useSnapshot } from 'valtio'
import { useRef } from 'react'
import { asyncFnCallCache, useProxyAsyncFn } from '../useProxyAsyncFn'
import { Commands, Resolves } from './config'
import { useWriteWithResponse } from './hooks'
import { whenever } from '@/utils'

type CommandsTypes = typeof Commands
type CommandsKeys = keyof CommandsTypes
type FnAny = (...args: any) => any
type FnReplRT<Fn extends FnAny, Rt> =
  (...args: [...Parameters<Fn>]) => Rt

export interface UseProxyBluetoothCommandOptions {
  until?: boolean
}

export function useProxyBluetoothCommand<Command extends CommandsKeys>(
  command: Command,
  options: UseProxyBluetoothCommandOptions = {},
) {
  const writeWithResponse = useWriteWithResponse()
  type AsFnCallback = typeof Commands[Command]
  type AsFnReturn = Promise<ReturnType<typeof Resolves[Command]>>
  const snapshot = useSnapshot(asyncFnCallCache)

  const promise = useRef<Promise<any>>()
  const locked = Object.values(snapshot).find(state => state.loading)
  const [state, callback] = useProxyAsyncFn<FnReplRT<AsFnCallback, AsFnReturn>>(
    `bluetooth:${command}`,
    async (...args: any) => {
      async function call() {
        // @ts-expect-error
        const cmd = Commands[command](...args)
        // console.log('write buffer: ', radix16bcd(cmd))
        const data = await writeWithResponse(cmd)
        const parsed = (Resolves as any)[command](data)
        // console.log(`notify event 16 data: `, { radix16: data, bcd: radix16bcd(data) })
        // console.log(`notify event parsed: `, parsed)
        return parsed
      }

      if (options.until && args[0] === 'next') {
        const data: any[] = []
        while (true) {
          const parsed = await call()
          const date = parsed[parsed.length - 1].date
          const last = data[data.length - 1].date
          if (date === last)
            break
          data.push(...parsed)
        }
        return data
      }
      return call()
    },
  )

  const execute: typeof callback = (...args: any) => {
    if (promise.current)
      return promise.current = promise.current.then(() => callback(...args))
    else
      return promise.current = callback(...args)
  }

  whenever(!locked, () => promise.current = undefined)

  return [
    state,
    execute,
  ] as const
}
