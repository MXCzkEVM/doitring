import { proxy } from 'valtio'

export const tutorials = proxy({
  video: false,
  syncs: false,
  group: false,
  chats: false,
  share: false,
  prophet: false,
})
