import { proxy } from 'valtio'
import { User } from '@/api/index.type'

export interface Deposited {
  receiver: string
  sender: string
  amount: bigint
  token: string
  memo: string
}

export const user = proxy({
  loading: false,
  detail: undefined as User | undefined,

  histories: [] as Deposited[],
})
