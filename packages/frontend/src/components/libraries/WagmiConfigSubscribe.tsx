import { useWhenever } from '@hairy/react-utils'
import { chains, updateProvider, updateSigner } from '@harsta/client'
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner, Network } from 'ethers'
import { useMount } from 'react-use'
import { useAccount, useChainId } from 'wagmi'

export function WagmiConfigSubscribe() {
  const account = useAccount()
  const chainId = useChainId()
  useWhenever(
    account.address,
    () => {
      const provider = new BrowserProvider(window.ethereum)
      const singer = new JsonRpcSigner(provider, account.address!)
      updateSigner(singer)
    },
    { immediate: true },
  )
  useWhenever(
    !!chainId,
    () => {
      const chain = Object.values(chains).find(chain => chain.id === chainId)
      if (!chain)
        return
      const rpc = chain.rpcUrls.default.http[0]
      const network = new Network(chain.name, chain.id)
      const provider = new JsonRpcProvider(rpc, network)
      Reflect.set(provider, 'chainId', chain.id)
      updateProvider(provider)
    },
    { immediate: true },
  )
  return null
}
