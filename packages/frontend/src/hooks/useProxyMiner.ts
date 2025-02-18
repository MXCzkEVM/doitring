/* eslint-disable ts/no-unused-expressions */
import { useAccount } from 'wagmi'
import { contracts } from '@harsta/client'
import { storeToStates } from './storeToStates'
import { Miner, store } from '@/store'
import { helperGetMiner } from '@/service'

export function useProxyMiner() {
  const {
    miner: [miner, setMiner],
    loading: [loading, setLoading],
  } = storeToStates(store.miner)

  const { address } = useAccount()

  async function request(type: 'reload' | 'personal' = 'reload') {
    setLoading(true)
    try {
      if (type === 'personal' && miner) {
        const newMiner = { ...miner }
        console.log(newMiner)
        await withPersonal(newMiner)
        setMiner(newMiner)
        setLoading(false)
        return
      }

      await clear()
      const _miner = await helperGetMiner({
        address: address!,
      })
      await withPersonal(_miner)
      _miner && setMiner(_miner)
      setLoading(false)
      return _miner
    }
    catch (error) {
      setLoading(false)
      throw error
    }
  }

  async function withPersonal(miner?: Miner) {
    if (!miner)
      return
    const Storage = contracts.Storage.resolve()
    const key = `ring_${miner.sncode}`
    const response = await Storage.getStorage(key, ['avatar', 'nickname'])
    Object.assign(miner, parse<any>(response))
    return miner
  }

  async function clear() {
    setMiner(undefined)
  }

  return [
    {
      loading,
      value: miner,
    },
    request,
    clear,
  ] as const
}

function parse<T>(response: [string[], string[]]) {
  try {
    const { 0: _keys, 1: values } = response || { 0: [], 1: [] }
    const object: Record<string, string> = {}
    for (let i = 0; i < _keys.length; i++)
      object[_keys[i]] = values[i]
    return object as T
  }
  catch {
    return {}
  }
}
