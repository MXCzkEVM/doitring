import { useExtendOverlay } from '@overlastic/react'
import { InputNumber, Modal, Tag } from 'antd'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { parseEther } from 'ethers'
import { useAsyncCallback, useWhenever } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { useAsyncFn } from 'react-use'
import { defaultAddresses as addresses, contracts } from '@harsta/client'
import { useTranslation } from 'react-i18next'
import { Trans } from '../libraries'
import { StakeTags } from '../data-display'
import { formatEtherByFormat, waitForProxyTransaction } from '@/utils'

export interface IncreaseStakeDialogProps {

}

export function IncreaseStakeDialog(_props: IncreaseStakeDialogProps) {
  const { resolve, visible, reject } = useExtendOverlay({ duration: 300 })
  const DoitRingStaked = contracts.DoitRingStaked.resolve()
  const Health = contracts.Health.resolve()
  const { t } = useTranslation()

  const { address } = useAccount()
  const [amount, setAmount] = useState<string | null>()
  const [
    { value: allowance = BigInt(0), loading: loadingByAllowance },
    reloadAllowance,
  ] = useAsyncFn(
    async () => Health.allowance(address!, addresses.DoitRingStaked),
    [address],
  )
  const [{ value: balance = BigInt(0) }, reloadBalance] = useAsyncFn(
    () => Health.balanceOf(address!),
  )

  const [loadingByStake, stake] = useAsyncCallback(async () => {
    const transaction = DoitRingStaked.create.populateTransaction(
      address!,
      addresses.Health,
      parseEther(String(amount!)),
    )
    await waitForProxyTransaction(transaction, 'create')
    await reloadBalance()
    resolve()
  })

  const [loadingByApprove, approve] = useAsyncCallback(async () => {
    const transaction = Health.proxy_approve.populateTransaction(
      address!,
      addresses.DoitRingStaked,
      parseEther(String(amount!)),
    )
    await waitForProxyTransaction(transaction, 'proxy_approve')
    await reloadAllowance()
    await stake()
  })

  const isConfirm = allowance >= parseEther(String(amount || '0'))

  useWhenever(address, reloadAllowance, { immediate: true })
  useWhenever(address, reloadBalance, { immediate: true })
  const loading = loadingByAllowance || loadingByApprove || loadingByStake

  function onInputTag(amount: string) {
    if (parseEther(amount) > balance)
      return
    setAmount(amount)
  }
  return (
    <Modal
      title={t('Add Blueberry Stake')}
      centered
      open={visible}
      onCancel={() => !loading && reject()}
      okText={isConfirm ? 'Confirm' : 'Approve'}
      okButtonProps={{ disabled: !amount, loading }}
      cancelButtonProps={{ disabled: loading }}
      onOk={isConfirm ? stake : approve}
    >

      <StakeTags
        className="my-12px"
        options={[
          { ring: '1', color: 'magenta' },
          { ring: '10', color: 'red' },
          { ring: '50', color: 'volcano' },
          { ring: '100', color: 'orange' },
          { ring: '500', color: 'pink' },
          { ring: '1000', color: 'gold' },
        ]}
        onTagClick={onInputTag}
        balance={balance}
      />

      <div className="flex font-bold justify-between mb-12px">
        <span>Available Tokens</span>
        <div>
          {formatEtherByFormat(balance)}
          {' '}
          Blueberry
        </div>
      </div>

      <InputNumber
        onChange={event => setAmount(event || undefined)}
        placeholder={t('Please enter the amount')}
        min="0"
        max={String(balance / (10n ** 18n))}
        value={amount}
        className="w-full"
        controls={false}
        disabled={loadingByApprove || loadingByStake || loadingByAllowance}
      />

      <div className="mt-12px text-14px">
        <Trans i18nKey="Increase Stake Text" amount={gain(amount)} />
      </div>

    </Modal>
  )
}
function gain(amount?: string | null) {
  const percent = amount
    ? removeExtraZero(new BigNumber(amount || '0').multipliedBy(50 / 1000).toFormat(5))
    : '0'
  return Math.min(Number.isNaN(+percent) ? 50 : +percent, 50)
}
function removeExtraZero(str: string) {
  return str.replace(/(\.\d*[1-9])0+$/, '$1')
}
