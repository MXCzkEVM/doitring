import { proxyWithPersistant } from '@hairy/react-utils'

export const config = proxyWithPersistant('config', {
  readHealthOracle: false,
  inviter: undefined as string | undefined,
  invite: undefined as string | undefined,

  reads: {} as Record<string, boolean>,

  mints: 0,

  inviteHandled: false,
})
