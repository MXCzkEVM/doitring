import { useExtendOverlay } from '@overlastic/react'
import { Button, Drawer, Modal, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import classNames from 'classnames'
import { If, proxyWithPersistant, storeToState } from '@hairy/react-utils'
import { Tabs } from '../data-display'
import { FingerMeasurementContent, sizes } from './FingerMeasurement.content'
import { FingerMeasurementTutorial } from './FingerMeasurement.tutorial'
import { mmToPixels } from '@/utils'

const config = proxyWithPersistant('tutorial', {
  read: false,
})

export interface FingerMeasurementDialogProps {
  tutorial?: boolean
}

export function FingerMeasurementDialog(props: FingerMeasurementDialogProps) {
  const { resolve, visible, reject } = useExtendOverlay({
    duration: 300,
  })
  const [read, setRead] = storeToState(config, 'read')
  const { t } = useTranslation()

  const [size, setSize] = useState(19.9)
  const index = sizes.findIndex(s => s.value === size)

  return (
    <Drawer
      className="max-w-xl mx-auto"
      title={(
        <div className="flex items-center gap-1">
          <span>{t('Measurement')}</span>
          <div
            onClick={() => read && setRead(false)}
            className="i-material-symbols-help-outline-rounded translate-y-1px"
          />
        </div>
      )}
      placement="bottom"
      height="70vh"
      open={visible}
      onClose={() => reject()}
      extra={(
        <Space>
          <Button
            onClick={() => resolve(sizes[index].label)}
            disabled={props.tutorial && !read}
            type="primary"
          >
            {t('Confirm')}
          </Button>
        </Space>
      )}
    >
      <div className="h-full overflow-hidden">
        <If
          cond={!props.tutorial || read}
          then={<FingerMeasurementContent onChange={setSize} value={size} />}
          else={<FingerMeasurementTutorial onEnded={() => setRead(true)} />}
        />
      </div>
    </Drawer>
  )
}
