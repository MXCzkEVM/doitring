import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { GroupMembers } from '../data-display'
import { noop } from '@/utils'

export function GroupMembersDialog() {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()

  return (
    <Modal
      title={t('All members')}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <GroupMembers />
    </Modal>
  )
}
