import { useExtendOverlay } from '@overlastic/react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { cover } from '@hairy/format'
import dayjs from 'dayjs'
import { If, useAsyncCallback, useEventBus } from '@hairy/react-utils'
import { copy, formatEtherByFormat, noop } from '@/utils'
import IconConfirmed from '@/assets/iconfonts/confirmed.svg'

export interface SynchronizedDialogProps {
  hash: string
  time: number
  amount: string
}

export function SynchronizedDialog(props: SynchronizedDialogProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { resolve, visible } = useExtendOverlay({ duration: 300 })
  const { emit: changeTabStaking } = useEventBus('device:tabs')

  return (
    <Modal
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
      maskClosable={false}
    >
      <div className="flex-col-center">
        <img className="mb-10px" src={IconConfirmed.src} />
        <span className="mb-10px">{t('Transaction Confirmed')}</span>
        <If
          cond={props.amount === '0'}
          then={(
            <Button
              className="mb-10px"
              type="primary"
              onClick={() => resolve()}
            >
              {t('Great Work')}
            </Button>
          )}
          else={(
            <Button
              className="mb-10px"
              type="primary"
              onClick={() => {
                changeTabStaking()
                resolve()
              }}
            >
              {t('Stake Now')}
            </Button>
          )}
        />
        <If
          cond={props.amount !== '0'}
          then={(
            <span>
              {t('Synced your Ring Data and Claimed')}
            </span>
          )}
          else={(
            <span>
              {t('Synced your Ring Data')}
            </span>
          )}
        />
        <If cond={props.amount !== '0'}>
          <span className="font-bold mb-10px">
            <span>{formatEtherByFormat(props.amount, 2)}</span>
            <span> $Blueberry Tokens</span>
          </span>
        </If>

        <div className="w-240px flex items-center justify-between">
          <span>
            {t('Transaction ID')}
            :
          </span>
          <div className="flex-center gap-2px" onClick={() => copy(props.hash)}>
            <span className="font-bold">{cover(props.hash, [4, 3, 4])}</span>
            <div className="i-ph-copy-simple-duotone" />
          </div>
        </div>
        <div className="w-240px flex items-center justify-between mb-10px">
          <span>
            {t('Executed on')}
            :
          </span>
          <span className="font-bold">
            {dayjs(props.time).format('MMMM DD, YYYY')}
          </span>
        </div>

        <Button
          className="mb-10px"
          onClick={() => router
            .push('/rewards/referral')
            .then(() => resolve())}
        >
          {t('Done')}
        </Button>
      </div>
    </Modal>
  )
}
