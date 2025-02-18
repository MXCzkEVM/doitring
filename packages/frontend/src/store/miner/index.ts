import { proxy } from 'valtio'
import { Instances } from '@harsta/client'

export interface Miner {
  token: string
  tokenId: number
  sncode: string
  owner: string
  name: string
  group?: number
  avatar?: string
  nickname?: string
}

export interface Reward {
  amount: string
  token: string
}

export interface Claimed {
  timestamp: number
  rewards: Instances.DoitRingDevice.RewardStructOutput[]
  tokenId: number
  token: string
  hash: string
  memo: string
}

export interface Step {
  value: number
  date: number
  kcal: number
  km: number
}

export interface Rate {
  date: number
  value: number
}

export interface Sleep {
  date: number
  value: number
}

export interface Oxygen {
  date: number
  value: number
}

export const miner = proxy({
  loading: false,
  miner: undefined as undefined | Miner,

  loadingByClaims: false,
  claims: [] as Claimed[],
  steps: [] as Step[],
  rates: [] as Rate[],
  sleeps: [] as Sleep[],
  oxygens: [] as Oxygen[],

})
