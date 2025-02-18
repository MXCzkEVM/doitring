import { useOverlayInject, useExtendOverlay } from '@overlastic/react'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { useAsyncCallback } from '@hairy/react-utils'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { ReactQrcodeScanner } from '../libraries/ReactQrcodeScanner'
import { GroupDetailDialog } from './GroupDetail'
import { getGroup, getGroupInviteIn } from '@/api'

export function GroupScannerDialog() {
  const { visible, reject, resolve } = useExtendOverlay({
    duration: 300,
  })
  const { t } = useTranslation()
  const openGroupDetailDialog = useOverlayInject(GroupDetailDialog)

  const [loading, onResolved] = useAsyncCallback(
    async (decodedText: string) => {
      if (await getGroupInviteIn({ in: decodedText })) {
        resolve()
        openGroupDetailDialog({ invite: decodedText })
      }
      else {
        toast.error(t(`Group not found`))
        reject()
      }
    },
  )

  return (
    <div
      className={classNames([
        'transition-opacity opacity-0 bg-[rgb(16,20,24,0.5)]',
        visible && '!opacity-100',
        'fixed inset-0 z-100',
        'flex-col-center',
      ])}
      onClick={() => reject()}
    >
      <Spin spinning={loading}>
        <div className="w-300px" onClick={event => event.stopPropagation()}>
          <ReactQrcodeScanner
            onSuccess={onResolved}
            onError={(message) => {
              toast.error(message)
              reject()
            }}
            fps={10}
            qrbox={{ width: 250, height: 250 }}
          />
        </div>
      </Spin>
    </div>
  )
}
