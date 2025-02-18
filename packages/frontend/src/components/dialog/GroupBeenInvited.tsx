import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { useAsync } from 'react-use'
import { useTranslation } from 'react-i18next'
import { GroupDetail } from '../data-display'
import { noop } from '@/utils'
import { getGroupInviteIn } from '@/api'

export interface GroupBeenInvitedDialogProps {
  invite: string
}

export function GroupBeenInvitedDialog(props: GroupBeenInvitedDialogProps) {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()
  return (
    <Modal
      title={t('Join Group Invitation')}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <div>
        {t('Detected Join Group Content')}
      </div>
      <GroupDetail
        invite={props.invite}
        onCancel={resolve}
        onJoined={() => resolve()}
      />
    </Modal>
  )
}
