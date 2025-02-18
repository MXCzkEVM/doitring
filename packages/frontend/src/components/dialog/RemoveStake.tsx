import { useAsyncCallback } from '@hairy/react-utils'
import { contracts } from '@harsta/client'
import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { waitForProxyTransaction } from '@/utils'

export interface RemoveStakeDialogProps {
  index: number
}
export function RemoveStakeDialog(props: RemoveStakeDialogProps) {
  const DoitRingStaked = contracts.DoitRingStaked.resolve()
  const { t } = useTranslation()
  const { address } = useAccount()

  const { resolve, visible, reject } = useExtendOverlay({ duration: 300 })
  const [loading, cancel] = useAsyncCallback(async () => {
    const transaction = DoitRingStaked.cancel.populateTransaction(address!, props.index)
    await waitForProxyTransaction(transaction, 'cancel')
    resolve()
  })

  return (
    <Modal
      title={t('Remove Ring Stake')}
      centered
      open={visible}
      onCancel={reject}
      okText="Unstake"
      okButtonProps={{ loading }}
      onOk={cancel}
    >
      By Unstaking $Blueberry you will reduce your current CP, and won't earn yield
    </Modal>
  )
}
