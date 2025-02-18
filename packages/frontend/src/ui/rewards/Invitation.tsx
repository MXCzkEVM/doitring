import { Button, Divider, QRCode } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useAsyncFn } from 'react-use'
import { useAsyncCallback, useWhenever } from '@hairy/react-utils'
import { defaultAddresses as addresses, contracts } from '@harsta/client'
import { formatEther } from 'ethers'
import { Card } from 'antd-mobile'
import { copy, waitForProxyTransaction } from '@/utils'
import { useProxyUser } from '@/hooks'
import { Invitations } from '@/components'
import { ReferralURL } from '@/config'

export function Invitation() {
  const { address } = useAccount()
  const { t } = useTranslation()

  const Savings = contracts.Savings.resolve()
  const [{ value: user }] = useProxyUser()

  const [{ value: balance = BigInt(0) }, reloadBalanceOf] = useAsyncFn(
    async () => Savings.balanceOf(address!, addresses.USDT),
    [address],
  )

  const [loading, withdraw] = useAsyncCallback(async () => {
    const SavingsWithSigner = contracts.Savings.resolve()
    const transaction = SavingsWithSigner.withdraw.populateTransaction(
      address!,
      addresses.USDT,
    )
    await waitForProxyTransaction(transaction, 'withdraw')
    await reloadBalanceOf()
  })

  const invited = user?.invited || 0

  useWhenever(address, reloadBalanceOf, { immediate: true })
  useWhenever(
    address,
    async () => {
      const events = await Savings.queryFilter(Savings.filters.Withdrawn(address))
      console.log(events)
    },
    { immediate: true },
  )
  return (
    <div>
      <div className="mb-24px">
        <div className="text-center my-2">
          {t('Invitation Page Title')}
        </div>
        <div className="text-center mb-16px">
          {t('Boost Invitation Text')}
        </div>
        <div className="flex-col-center gap-2">
          <div className="text-16px">Your Website URLs</div>
          <QRCode size={120} value={address!} />
          <Button
            onClick={() =>
              copy(`${ReferralURL}?url=${location.origin}?inviter=${address!}`)}
            className="flex-center gap-4px"
            type="text"
          >
            {/* <div>{cover(address!, [6, 4, 6])}</div> */}
            <div>COPY LINK</div>
            <div className="i-ph-copy-simple-duotone" />
          </Button>
        </div>
        <ul className="pl-8">
          <li>{t('Invitation Text 1')}</li>
          <li>{t('Invitation Text 2')}</li>
          <li>{t('Invitation Text 3')}</li>
        </ul>
      </div>

      <div className="flex gap-2">
        <Card className="flex-1">
          <span>Invited </span>
          <span>{invited}</span>
        </Card>
        <Card className="flex-1">
          <span>Earned </span>
          <span>{invited * 33.8}</span>
          <span> USDT</span>
        </Card>
      </div>

      <Divider />

      <div className="flex justify-between items-center gap-6">
        <div className="text-16px font-bold flex-1">
          {t('Reward')}
        </div>
        <span className="text-[rgba(255,255,255,0.45)] text-14px">
          {formatEther(balance)}
          {' '}
          USDT
        </span>
        <Button disabled={balance === 0n} onClick={withdraw} loading={loading}>
          {t('Withdraw')}
        </Button>
      </div>

      <Invitations />
    </div>
  )
}
