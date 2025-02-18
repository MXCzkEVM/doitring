import { useExtendOverlay } from '@overlastic/react'
import { Modal, Table, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { TransactionHash } from '../utils'
import { formatEtherByFormat, noop } from '@/utils'
import { useProxyMinerDetail } from '@/hooks'
import { Claimed } from '@/store/miner'

export interface EpochRewardDialogProps {

}

export function EpochRewardDialog(_props: EpochRewardDialogProps) {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()
  const [{ value: { claims } }] = useProxyMinerDetail()

  const columns: ColumnsType<Claimed> = [
    {
      title: t('Time'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: timestamp => dayjs.unix(Number(timestamp)).format('MM/DD'),
    },
    {
      title: t('Rewards'),
      dataIndex: 'rewards',
      key: 'rewards',
      render: (value) => {
        return (
          <div>
            <span>
              {formatEtherByFormat(value?.[0]?.[1], 2)}
              {' '}
            </span>
            <span>Blueberry</span>
          </div>
        )
      },
    },
    {
      title: t('Transaction Hash'),
      dataIndex: 'hash',
      key: 'hash',
      render: value => <TransactionHash link hash={value} />,
    },
  ]

  return (
    <Modal
      className="m-0"
      title={(
        <div className="flex items-center gap-1">
          <span>{t('Synchronize History')}</span>
          <Tooltip trigger="click" title={t('Cliam Tip')}>
            <div className="i-material-symbols-help-outline-rounded translate-y-1px" />
          </Tooltip>
        </div>
      )}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <Table rowKey="hash" pagination={{ pageSize: 4 }} dataSource={claims} columns={columns} />
    </Modal>
  )
}
