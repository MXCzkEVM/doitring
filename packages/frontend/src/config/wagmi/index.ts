/* eslint-disable ts/ban-ts-comment */
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet as _metaMaskWallet, coinbaseWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'

import { createConfig } from 'wagmi'
import { chains } from '@harsta/client'
import { getInjectedConnector } from './utils'

function metaMaskWallet(options: any) {
  const source = _metaMaskWallet(options)
  return {
    ...source,
    createConnector: getInjectedConnector({
      target: typeof window !== 'undefined' && window.ethereum || undefined,
    }),
  }
}

function moonBaseWallet(options: any) {
  const source = metaMaskWallet(options)
  source.iconUrl = 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo.svg'
  source.name = 'MoonBase'
  source.id = 'moon_base'
  source.iconBackground = '#FFFFFF'
  return source
}

export const wallets = getDefaultWallets().wallets
export const connectors = connectorsForWallets(
  [{
    groupName: 'Recommended',
    wallets: [
      moonBaseWallet,
      metaMaskWallet,
      coinbaseWallet,
      walletConnectWallet,
    ],
  }],
  {
    appName: 'Starter',
    projectId: '019ca23f39a338bb3d0600cf1cae08fa',
  },
)

// @ts-expect-error
export const config = createConfig({
  connectors,
  chains: process.env.NEXT_PUBLIC_DEFAULT_CHAIN === 'geneva'
    ? [chains.geneva]
    : [chains.moonchain],
  ssr: true,
})
