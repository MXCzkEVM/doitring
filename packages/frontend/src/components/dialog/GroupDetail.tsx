import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { GroupDetail } from '../data-display'
import { noop } from '@/utils'

interface GroupDetailDialogProps {
  group?: number
  invite?: string
}

export function GroupDetailDialog(props: GroupDetailDialogProps) {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()

  return (
    <Modal
      title={t('Group Detail')}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <GroupDetail
        {...props}
        onCancel={resolve}
        onJoined={() => resolve()}
      />
    </Modal>
  )
}
