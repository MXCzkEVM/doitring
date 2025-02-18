import { useAsyncFn, useMount } from 'react-use'
import { Modal, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAsyncCallback } from '@hairy/react-utils'
import dayjs from 'dayjs'
import { contracts } from '@harsta/client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { waitForProxyTransaction } from '@/utils'

export interface ButtonWithStakingCancelProps {
  index: number
  onCanceled?: () => void
}

export function ButtonWithStakingCancel(props: ButtonWithStakingCancelProps) {
  const DoitRingStaked = contracts.DoitRingStaked.resolve()
  const { t } = useTranslation()
  const { address } = useAccount()
  const [{ value: expiration = 0 }, reloadExpiration] = useAsyncFn(
    () => DoitRingStaked.expiration(address!, props.index).then(Number),
    [props.index],
  )
  const [modal, holder] = Modal.useModal()
  const [time] = useState(dayjs().unix())

  const [_1, cancel] = useAsyncCallback(async () => {
    const confirmed = await modal.confirm({
      title: t('Warning'),
      content: t('Cancelling will Text'),
    })
    if (!confirmed)
      return
    const transaction = DoitRingStaked.cancel.populateTransaction(address!, props.index)
    await waitForProxyTransaction(transaction, 'cancel')
    await reloadExpiration()
  })

  const [_2, claim] = useAsyncCallback(async () => {
    const confirmed = await modal.confirm({
      title: t('Claim your tokens'),
      content: (
        <div className="flex gap-2">
          <div>{t('Claim will Text')}</div>
        </div>
      ),
    })
    if (!confirmed)
      return
    const transaction = DoitRingStaked.claim.populateTransaction(address!, props.index)
    await waitForProxyTransaction(transaction, 'claim')
    await reloadExpiration()
    props.onCanceled?.()
  })

  const actions = {
    cancel: {
      children: t('Staked'),
      onClick: cancel,
      color: 'green',
    },
    claim: {
      children: t('Unclaimed'),
      onClick: claim,
      color: 'orange',
    },
    locking: {
      children: `${t('Unstaking')}`,
      disabled: true,
      color: '',
    },
  }

  let current: any
  if (expiration) {
    if (time > expiration) {
      current = actions.claim
    }
    else {
      current = actions.locking
    }
  }
  else {
    current = actions.cancel
  }

  useMount(reloadExpiration)
  return (
    <>
      {holder}
      <Tag {...current} />
    </>
  )
}
