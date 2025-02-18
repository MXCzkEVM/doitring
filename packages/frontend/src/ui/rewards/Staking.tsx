import { Button, Divider, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAsyncFn } from 'react-use'
import { useAccount } from 'wagmi'
import { useWhenever } from '@hairy/react-utils'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useOverlayInject } from '@overlastic/react'
import { addresses, contracts, defaultAddresses } from '@harsta/client'
import { parseEther } from 'ethers'
import { ButtonWithStakingCancel, IncreaseStakeDialog, StakeTags } from '@/components'
import { formatEtherByFormat, waitForProxyTransaction } from '@/utils'
import { getEstimateBonusStake } from '@/api'

export function Staking() {
  const openIncreaseStakeDialog = useOverlayInject(IncreaseStakeDialog)
  const { t } = useTranslation()
  const { address } = useAccount()
  const DoitRingStaked = contracts.DoitRingStaked.resolve()
  const Health = contracts.Health.resolve()

  const [{ value: balance = BigInt(0) }, reloadBalance] = useAsyncFn(
    () => Health.balanceOf(address!),
  )

  const [{ value: cp = 0 }, reloadCP] = useAsyncFn(
    async () => address ? (await getEstimateBonusStake({ owner: address! })).data : undefined,
    [address],
  )

  const [{ value: allowance = BigInt(0) }, reloadAllowance] = useAsyncFn(
    async () => Health.allowance(address!, defaultAddresses.DoitRingStaked),
    [address],
  )

  const [{ value: stakes = [], loading }, reloadStakes] = useAsyncFn(
    async () => {
      const stakes = await DoitRingStaked.stakes(address!)
      const data = [...stakes]
        .filter(s => s.token !== defaultAddresses.ZERO)

      data.sort((a, b) => Number(b.timestamp - a.timestamp))

      return data
    },
    [address],
  )

  const balanceOf = stakes
    .filter(s => s.token === defaultAddresses.Health)
    .reduce((c, s) => c += s.amount, BigInt(0))

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: value => `# ${Number(value)}`,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: value => dayjs.unix(Number(value)).format('MM/DD/YYYY'),
      width: 120,
    },
    {
      title: 'Balance',
      dataIndex: 'amount',
      width: 100,
      key: 'amount',
      render: value => `${formatEtherByFormat(value, 2)}`,
    },
    {
      title: 'Action',
      dataIndex: 'index',
      width: 100,
      render: (value) => {
        return (
          <ButtonWithStakingCancel
            onCanceled={reloadStakes}
            index={value}
          />
        )
      },
    },
  ]

  useWhenever(address, reloadStakes, { immediate: true })
  useWhenever(address, reloadBalance, { immediate: true })
  useWhenever(address, reloadCP, { immediate: true })

  async function onInputTag(amount: string) {
    if (allowance < parseEther(amount)) {
      const transaction = Health.proxy_approve.populateTransaction(
        address!,
        defaultAddresses.DoitRingStaked,
        parseEther(String(amount!)),
      )
      await waitForProxyTransaction(transaction, 'proxy_approve')
      await reloadAllowance()
    }

    const transaction = DoitRingStaked.create.populateTransaction(
      address!,
      defaultAddresses.Health,
      parseEther(String(amount!)),
    )
    await waitForProxyTransaction(transaction, 'create')

    await Promise.all([
      reloadStakes(),
      reloadBalance(),
      reloadCP(),
    ])
  }
  return (
    <>
      <div className="mb-24px">
        <p>{t('New Staking Text 1')}</p>
        <p>{t('New Staking Text 2')}</p>
      </div>

      <StakeTags
        className="mb-24px"
        type="ring"
        options={[
          { ring: '30', borderColor: '#CD8032', color: '#CD80324D' },
          { ring: '100', borderColor: '#C0C0C0', color: '#C0C0C04D' },
          { ring: '1000', borderColor: '#FED700', color: '#FED7004D' },
        ]}
        onTagClick={onInputTag}
        balance={balance}
      />

      <div className="text-16px font-bold mb-5px">
        Your BalanceOf
      </div>
      <div className="bg-[#141414] rounded-5px h-30px px-10px flex justify-end items-center mb-12px text-12px">
        {formatEtherByFormat(balance, 2)}
        {' '}
        $BLUEBERRY
      </div>

      <div className="text-16px font-bold mb-5px">
        Your Staked
      </div>
      <div className="bg-[#141414] rounded-5px h-30px px-10px flex justify-end items-center mb-12px text-12px">
        {formatEtherByFormat(balanceOf, 2)}
        {' '}
        $BLUEBERRY
      </div>

      <div className="text-16px font-bold mb-5px">
        Your Staking CP
      </div>
      <div className="bg-[#141414] rounded-5px h-30px px-10px flex justify-end items-center mb-24px text-12px">
        {cp}
        %
      </div>

      <div className="mb-24px">
        <Button
          className="w-full"
          type="primary"
          onClick={() => openIncreaseStakeDialog().then(() => {
            reloadStakes()
            reloadBalance()
            reloadCP()
          })}
        >
          {t('Add Stake')}
        </Button>
      </div>

      <Table
        dataSource={stakes}
        bordered={false}
        loading={loading}
        columns={columns}
        size="small"
      />

    </>
  )
}
