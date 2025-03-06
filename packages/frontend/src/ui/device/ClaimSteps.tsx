import { Button } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { storeToState, useAsyncCallback } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useOverlayInject } from '@overlastic/react'

import { contracts } from '@harsta/client'
import { compress, formatEtherByFormat, waitForProxyTransaction } from '@/utils'
import { store } from '@/store'
import { useProxyBluetooth, useProxyBluetoothCommand, useProxyMinerDetail } from '@/hooks'
import { Card, EpochRewardDialog, SynchronizedDialog, SyncingDialog } from '@/components'
import { getSignClaim, postSignClaimCount } from '@/api'
import { useRequestIntel } from '@/hooks/useRequestIntel'

export function ClaimSteps() {
  const { address } = useAccount()
  const { t } = useTranslation()

  const [miner] = storeToState(store.miner, 'miner')
  const [mints, setMints] = storeToState(store.config, 'mints')

  const [{ value: detail }, fetchMinerDetail] = useProxyMinerDetail()
  const [{ value: intel }, reloadIntel] = useRequestIntel()
  const [{ connected }, fetchBluetooth] = useProxyBluetooth()

  const openEpochRewardDialog = useOverlayInject(EpochRewardDialog)
  const openSynchronizedDialog = useOverlayInject(SynchronizedDialog)
  const openSyncingDialog = useOverlayInject<any, void>(SyncingDialog)

  const DoitRingDevice = contracts.DoitRingDevice.resolve()

  const fetchReadBloodOxygens = useProxyBluetoothCommand('readBloodOxygens', { until: true })[1]
  const fetchReadHeartRates = useProxyBluetoothCommand('readHeartRates', { until: true })[1]
  const fetchReadSleep = useProxyBluetoothCommand('readSleep', { until: true })[1]
  const fetchReadSteps = useProxyBluetoothCommand('readSteps', { until: true })[1]

  async function requestPacket() {
    if (!connected) {
      await fetchBluetooth()
      return { json: null, data: null }
    }
    const sleeps = await fetchReadSleep().then(withDateSlic(detail.sleeps.at(-1)?.date))
    const steps = await fetchReadSteps().then(withDateSlic(detail.steps.at(-1)?.date))
    const rates = await fetchReadHeartRates().then(withDateSlic(detail.rates.at(-1)?.date))
    const oxygens = await fetchReadBloodOxygens().then(withDateSlic(detail.oxygens.at(-1)?.date))

    const data = { sleeps, steps, rates, oxygens }
    const content = JSON.stringify(data)

    console.log('[debug] content --- ', {
      sleeps: sleeps.map(withItemTime),
      steps: steps.map(withItemTime),
      rates: rates.map(withItemTime),
      oxygens: oxygens.map(withItemTime),
    })

    const mep3355 = {
      format: 'MEP-3355',
      version: '1.0.0',
      metadata: {
        data_source: 'BlueberryRingV1',
        data_collection_method: 'bluetooth',
        preprocessing: 'weighted average of data',
      },
      data: [
        {
          type: 'sensor',
          content: await compress(content),
          compression: 'brotli',
        },
      ],
    }

    console.log('[debug] data --- ', mep3355)

    return {
      json: JSON.stringify(mep3355),
      data,
    }
  }

  async function requestSync() {
    if (!address || !miner)
      return

    const { json } = await requestPacket()

    if (!json)
      return

    const signatured = await getSignClaim({ sender: address })

    if (!signatured)
      return

    console.log('signatured: ', signatured)

    const populateTransaction = DoitRingDevice.claim.populateTransaction(
      address!,
      signatured.uid,
      miner.sncode,
      signatured.rewards,
      signatured.signature,
      json,
    )

    const transaction = await waitForProxyTransaction(populateTransaction, 'claim')
    await Promise.all([
      postSignClaimCount({ uid: signatured.uid }),
      fetchMinerDetail(miner),
    ])

    await reloadIntel()
    setMints(mints + 1)

    return {
      hash: transaction!.hash,
      amount: signatured.rewards[0].amount,
    }
  }

  const [loadingByClaim, onSyncClaim] = useAsyncCallback(async () => {
    if (!connected) {
      await fetchBluetooth()
      return
    }
    const instance = openSyncingDialog()
    const promise = requestSync()
    const trans = await promise.finally(instance.resolve)

    await new Promise(resolve => setTimeout(resolve, 500))

    openSynchronizedDialog({
      amount: trans!.amount,
      hash: trans!.hash,
      time: dayjs().valueOf(),
    })
  })

  return (
    <>
      <div className="mt-24px mb-10px flex items-center gap-5px">
        <span className="text-16px font-bold">
          {t('Sync Data _ Claim')}
        </span>
        <div
          className="i-material-symbols-history-rounded text-18px translate-y-1.5px"
          onClick={openEpochRewardDialog}
        />
      </div>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-12px text-[rgba(255,255,255,0.5)]">
              Group Lv.
              {intel?.level || 0}
              {' '}
              {t('Remaining Sync Live Data')}
              {' '}
              {intel?.claimed || '0'}
              /
              {intel?.claims || '-'}
            </div>
            <div className="text-12px">
              <span>
                {t('Sync Reward')}
                :
              </span>
              <span>
                {' '}
                {formatEtherByFormat(intel?.amount, 2)}
                {' '}
              </span>
              <span>$Blueberry</span>
            </div>

          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={intel?.claims === intel?.claimed}
              loading={loadingByClaim}
              onClick={onSyncClaim}
              type="primary"
              size="small"
            >
              Sync & Claim
            </Button>
          </div>
        </div>
      </Card>

    </>
  )
}

function withDateSlic<T>(date?: number) {
  return (array: T[]) => {
    return date
      ? array.filter((item: any) => item.date > (date || 0)) as T[]
      : array
  }
}

function withItemTime<T extends Record<string, any>>(item: T): T & { time: string } {
  return { ...item, time: dayjs.unix(item.date).format('YYYY-MM-DD HH:mm:ss') }
}
