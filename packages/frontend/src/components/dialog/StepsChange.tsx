import { useExtendOverlay } from '@overlastic/react'
import { InputNumber, Modal } from 'antd'
import { useState } from 'react'
import { useAsyncCallback } from '@hairy/react-utils'
import { contracts } from '@harsta/client'
import { useTranslation } from 'react-i18next'
import { useProxyMiner } from '@/hooks'
import { waitForProxyTransaction } from '@/utils'

export interface StepsChangeProps {
  default?: bigint
}

export function StepsChangeDialog(props: StepsChangeProps) {
  const { resolve, visible } = useExtendOverlay({ duration: 300 })
  const [{ value: miner }] = useProxyMiner()
  const { t } = useTranslation()
  const [total, setTotal] = useState(String(props.default || 0))
  const Storage = contracts.Storage.resolve()
  const [loading, onConfirm] = useAsyncCallback(async () => {
    const transaction = Storage.setItem.populateTransaction(
      `ring_${miner!.sncode}`,
      'steps',
      String(total),
    )
    await waitForProxyTransaction(transaction, 'setItem')
    resolve()
  })

  return (
    <Modal
      title={t('Change step target')}
      centered
      open={visible}
      onCancel={resolve}
      okButtonProps={{
        disabled: total === String(props.default) || !total,
        loading,
      }}
      onOk={onConfirm}
    >
      <InputNumber
        className="w-full"
        value={total}
        onChange={value => setTotal(value || '0')}
        placeholder={t('Please enter your target number of steps')}
        max="1000000"
        min="500"
      />
    </Modal>
  )
}
