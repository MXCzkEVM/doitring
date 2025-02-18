/* eslint-disable ts/no-use-before-define */
import { Button } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { storeToState, useAsyncCallback, useWhenever } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useOverlayInject } from '@overlastic/react'

import { contracts } from '@harsta/client'
import { useAsyncFn, useMount } from 'react-use'
import { compress, formatEtherByFormat, waitForProxyTransaction } from '@/utils'
import { store } from '@/store'
import { useProxyBluetooth, useProxyBluetoothCommand, useProxyMinerDetail } from '@/hooks'
import { Card, EpochRewardDialog, PairRingDrawer, SynchronizedDialog, SyncingDialog } from '@/components'
import { getSignClaim, getSignClaimIntel, postSignClaimCount } from '@/api'

export function ClaimSteps() {
  const { address } = useAccount()
  const [miner] = storeToState(store.miner, 'miner')
  const [mints, setMints] = storeToState(store.config, 'mints')
  const [{ value: detail }, fetchMinerDetail] = useProxyMinerDetail()
  const [{ value: { bluetooth } }] = useProxyBluetooth()
  const openEpochRewardDialog = useOverlayInject(EpochRewardDialog)
  const openSynchronizedDialog = useOverlayInject(SynchronizedDialog)
  const openPairRingDrawer = useOverlayInject(PairRingDrawer)
  const openSyncingDialog = useOverlayInject<any, void>(SyncingDialog)
  const { t } = useTranslation()

  const fetchReadBloodOxygens = useProxyBluetoothCommand('readBloodOxygens', { until: true })[1]
  const fetchReadHeartRates = useProxyBluetoothCommand('readHeartRates', { until: true })[1]
  const fetchReadSleep = useProxyBluetoothCommand('readSleep', { until: true })[1]
  const fetchReadSteps = useProxyBluetoothCommand('readSteps', { until: true })[1]

  const isIncorrectDevice = useMemo(
    () => bluetooth?.name !== miner?.sncode,
    [miner, bluetooth],
  )
  const isConnected = bluetooth && miner && !isIncorrectDevice

  async function fetchDataPacket() {
    if (!isConnected) {
      await openPairRingDrawer()
      return
    }
    const sleeps = await fetchReadSleep()
      .then(arr => arrayFilterDate(arr, detail.sleeps.at(-1)?.date))
    const steps = await fetchReadSteps()
      .then(arr => arrayFilterDate(arr, detail.steps.at(-1)?.date))
    const rates = await fetchReadHeartRates()
      .then(arr => arrayFilterDate(arr, detail.rates.at(-1)?.date))
    const oxygens = await fetchReadBloodOxygens()
      .then(arr => arrayFilterDate(arr, detail.oxygens.at(-1)?.date))

    const data = { sleeps, steps, rates, oxygens }
    const content = JSON.stringify(data)

    console.log('content --- ', {
      sleeps: sleeps.map(itemWithTime),
      steps: steps.map(itemWithTime),
      rates: rates.map(itemWithTime),
      oxygens: oxygens.map(itemWithTime),
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

    console.log('data --- ', mep3355)

    return {
      json: JSON.stringify(mep3355),
      data,
    }
  }

  async function deleteDataPacket() {
    // await writeRestore()
    // await writeTime(dayjs().format())

    // await deleteReadBloodOxygens()
    // await deleteReadHeartRates()
    // await deleteReadSleep('pos')
    // await deleteReadSteps()
  }

  async function _onSyncClaim() {
    if (!address || !miner)
      return
    const DoitRingDevice = contracts.DoitRingDevice.resolve()

    const result = await fetchDataPacket()
    if (!result)
      return
    const { json } = result
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
      deleteDataPacket(),
    ])
    await reloadIntel()
    setMints(mints + 1)

    return {
      hash: transaction!.hash,
      amount: signatured.rewards[0].amount,
    }
  }

  const [{ value: intel }, reloadIntel] = useAsyncFn(async () => {
    if (!address)
      return
    return getSignClaimIntel({ sender: address })
  }, [address])

  const [loadingByClaim, onSyncClaim] = useAsyncCallback(async () => {
    if (!isConnected) {
      await openPairRingDrawer()
      return
    }
    const instance = openSyncingDialog()
    const promise = _onSyncClaim()
    const trans = await promise.finally(instance.resolve)

    await new Promise(resolve => setTimeout(resolve, 500))

    openSynchronizedDialog({
      amount: trans!.amount,
      hash: trans!.hash,
      time: dayjs().valueOf(),
    })
  })

  useMount(() => {

  })
  useWhenever(address, reloadIntel, { immediate: true })
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

async function arrayFilterDate<T>(array: T[], date?: number) {
  if (!date)
    return array
  return array.filter((item: any) => item.date > (date || 0)) as T[]
}

function itemWithTime<T extends Record<string, any>>(item: T): T & { time: string } {
  return { ...item, time: dayjs.unix(item.date).format('YYYY-MM-DD HH:mm:ss') }
}
