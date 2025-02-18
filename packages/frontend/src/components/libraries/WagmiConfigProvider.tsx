import type { WagmiProviderProps } from 'wagmi'
import { WagmiProvider, useClient, useConnectorClient } from 'wagmi'
import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfigSubscribe } from './WagmiConfigSubscribe'

export function WagmiConfigProvider(props: PropsWithChildren<WagmiProviderProps>) {
  const client = new QueryClient()

  return (
    <WagmiProvider {...props}>
      <QueryClientProvider client={client}>
        <WagmiConfigSubscribe />
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
