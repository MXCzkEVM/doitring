import dayjs from 'dayjs'
import { storeToStates } from './storeToStates'
import { Miner, store } from '@/store'
import { helperGetClaims } from '@/service'
import { decompress } from '@/utils'

export function useProxyMinerDetail() {
  const {
    claims: [claims, setClaims],
    loadingByClaims: [loading, setLoading],
    oxygens: [oxygens, setOxygens],
    sleeps: [sleeps, setSleeps],
    rates: [rates, setRates],
    steps: [steps, setSteps],
  } = storeToStates(store.miner)

  async function request(miner: Miner) {
    setLoading(true)
    try {
      await clear()
      const claims = await helperGetClaims({ miner })
        .then(claims => claims.filter(c => c.uid.startsWith('uid:device')))
        .then(claims => claims.sort((a, b) => b.timestamp - a.timestamp))

      const processes = claims
        .filter(claim => isMep3355(claim.memo))
        .map(claim => JSON.parse(claim.memo).data[0].content)

      const dataJsonPackets = await Promise.all(processes.map(decompress))

      const dataPackets: Record<string, any[]>[] = dataJsonPackets
        .map(str => JSON.parse(str))

      setOxygens(dataPackets.flatMap(d => d.oxygens).sort((a, b) => a.date - b.date).map(itemWithTime))
      setSleeps(dataPackets.flatMap(d => d.sleeps).sort((a, b) => a.date - b.date).map(itemWithTime))
      setRates(dataPackets.flatMap(d => d.rates).sort((a, b) => a.date - b.date).map(itemWithTime))
      setSteps(dataPackets.flatMap(d => d.steps).sort((a, b) => a.date - b.date).map(itemWithTime))

      setClaims(claims)
      setLoading(false)
    }
    catch (error) {
      setLoading(false)
      throw error
    }
  }

  async function clear() {
    setClaims([])
    setOxygens([])
    setSleeps([])
    setRates([])
    setSteps([])
  }

  return [
    {
      loading,
      value: {
        claims,
        oxygens,
        sleeps,
        rates,
        steps,
      },
    },
    request,
    clear,
  ] as const
}

function isMep3355(memo: string) {
  try {
    return JSON.parse(memo).format === 'MEP-3355'
  }
  catch {
    return false
  }
}

function itemWithTime<T extends Record<string, any>>(item: T): T & { time: string } {
  return { ...item, time: dayjs.unix(item.date).format('YYYY-MM-DD HH:mm:ss') }
}
