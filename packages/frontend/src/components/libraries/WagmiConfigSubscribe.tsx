import { useWhenever } from '@hairy/react-utils'
import { chains, updateProvider, updateSigner } from '@harsta/client'
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner, Network } from 'ethers'
import { useAccount, useChainId } from 'wagmi'

export function WagmiConfigSubscribe() {
  const account = useAccount()
  useWhenever(
    account.address,
    () => {
      const provider = new BrowserProvider(window.ethereum)
      const singer = new JsonRpcSigner(provider, account.address!)
      updateSigner(singer)
    },
    { immediate: true },
  )

  return null
}
