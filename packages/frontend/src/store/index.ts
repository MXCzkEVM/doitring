import { miner } from './miner'
import { bluetooth } from './bluetooth'
import { user } from './user'
import { config } from './config'
import { tutorials } from './tutorials'

export const store = {
  tutorials,
  bluetooth,
  config,
  miner,
  user,
}

export * from './miner'
