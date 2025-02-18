import { useExtendOverlay } from '@overlastic/react'
import { Button, Modal, Tabs } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { EditProfile, Invitations } from '../data-display'
import { noop } from '@/utils'

export function UserInfoDialog() {
  const router = useRouter()

  const { resolve, visible, reject } = useExtendOverlay({
    duration: 300,
  })

  const { t } = useTranslation()
  return (
    <Modal
      title={t('Your Personal Profile')}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <Tabs
        size="small"
        items={[
          {
            key: 'invite',
            label: t('Invite Friends'),
            children: (
              <div className="dqw">
                <Button
                  onClick={() => router
                    .push('/rewards/referral')
                    .then(() => resolve())}
                  type="primary"
                  className="w-full mb-12px"
                >
                  {t('Invite Your Friend')}
                </Button>
                <Invitations />
              </div>
            ),
          },
          {
            key: '',
            label: t('Edit Profile'),
            children: <EditProfile onChanged={resolve} onCancel={reject} />,
          },
        ]}
      />
    </Modal>
  )
}
