/* eslint-disable ts/no-unsafe-function-type */

import { useTranslation } from 'react-i18next'
import { contracts } from '@harsta/client'
import { useAccount } from 'wagmi'
import { ButtonWithLoading, ButtonWithLoadingProps } from '../utils'
import { waitForProxyTransaction } from '@/utils'

export interface MintButtonProps extends ButtonWithLoadingProps {
  onConfirm?: Function
}

export function MintButton(props: MintButtonProps) {
  const { t } = useTranslation()
  const { address } = useAccount()
  async function onMint() {
    const contract = contracts.DoitRingNFT.resolve()
    const transaction = await contract.mint.populateTransaction(address!)
    await waitForProxyTransaction(transaction, 'mint')
    await props.onConfirm?.()
  }

  return (
    <ButtonWithLoading {...props} onClick={onMint}>
      {t('Mint')}
    </ButtonWithLoading>
  )
}
