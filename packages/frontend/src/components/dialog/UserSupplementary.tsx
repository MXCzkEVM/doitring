import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { EditProfile } from '../data-display'
import { noop } from '@/utils'

export function UserSupplementaryDialog() {
  const { resolve, reject, visible } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()

  return (
    <Modal
      title={t('Ensure your profile is complete')}
      open={visible}
      centered
      onCancel={reject}
      footer={noop}
    >
      <div className="mt-5">
        {t('User Supplementary Text')}
      </div>

      <EditProfile
        onChanged={resolve}
        onCancel={reject}
      />
    </Modal>
  )
}
