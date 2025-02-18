import { Button, Statistic } from 'antd'
import dayjs from 'dayjs'
import { useAsyncFn } from 'react-use'
import { If, useWhenever } from '@hairy/react-utils'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { contracts, defaultAddresses } from '@harsta/client'
import { useTranslation } from 'react-i18next'
import { Group } from '@/api/index.type'
import { useProxyMiner } from '@/hooks'
import { helperGetClaims } from '@/service'
import { formatEther, formatEtherByFormat, waitForProxyTransaction } from '@/utils'
import { Trans } from '@/components'
import { getSignGroupClaim } from '@/api'

export interface MonthlyClaimProps {
  group: Group
}

export function MonthlyClaim(props: MonthlyClaimProps) {
  const createAtNextMonthly = nextMonthly(props.group.timestamp)

  const { t } = useTranslation()
  const [{ value: miner }] = useProxyMiner()
  const { address } = useAccount()
  const [{ value: claims = [] }, fetchClaims] = useAsyncFn(
    async () => {
      const claims = await helperGetClaims({ miner: miner! })
      return claims.filter(claim => claim.uid.startsWith('uid:group'))
    },
    [miner],
  )

  const initialized = dayjs().valueOf() > createAtNextMonthly.valueOf()
  const countdown = initialized
    ? createAtNextMonthly.valueOf()
    : nextMonthly().valueOf()

  const balance = useMemo(
    () => claims.reduce((pre, cur) => pre + cur.rewards[0].amount, 0n),
    [claims],
  )
  const claimed = useMemo(
    () => {
      const atTimestamp = claims.at(-1)?.timestamp
      return atTimestamp
        && dayjs.unix(atTimestamp).format('MM-YYYY')
        === dayjs().format('MM-YYYY')
    },
    [claims],
  )
  const lastClaimed = claims.at(-1)

  useWhenever(miner, fetchClaims, { immediate: true })

  async function claim() {
    if (!miner || !miner.group)
      return
    const DoitRingDevice = contracts.DoitRingDevice.resolve()

    const signatured = await getSignGroupClaim({
      group: miner.group,
      sender: address!,
    })

    if (!signatured)
      return
    const transaction = DoitRingDevice.claim.populateTransaction(
      address!,
      signatured.uid,
      miner.sncode,
      signatured.rewards,
      signatured.signature,
      '{}',
    )
    await waitForProxyTransaction(transaction, 'claim')
    await fetchClaims()
  }

  return (
    <div className="mx-17px mb-24px flex items-center justify-between">
      <div className="flex-col text-12px">
        <span>
          <Trans
            i18nKey="Claimed income text"
            amount={formatEtherByFormat(balance, 2)}
          />
        </span>
        <If cond={lastClaimed}>
          <span className="text-[rgba(255,255,255,.45)]">
            {t('Updated')}
            :
            {dayjs.unix(lastClaimed?.timestamp || 0).format('YYYY-MM')}
          </span>
        </If>
      </div>
      <If
        cond={initialized && !claimed}
        else={(
          <Button disabled type="primary" size="small">
            <Statistic.Countdown
              valueStyle={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '12px',
              }}
              value={countdown}
              format="H[h] mm[m] ss[s]"
            />
          </Button>
        )}
      >
        <Button onClick={claim}>
          {t('Claim')}
        </Button>
      </If>
    </div>
  )
}

function nextMonthly(date?: dayjs.ConfigType) {
  let time = dayjs(date)
  time = time.month(time.month() + 1)
  time = time.date(1)
  return time
}
