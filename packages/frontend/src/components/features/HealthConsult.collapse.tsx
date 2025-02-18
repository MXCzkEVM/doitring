import { If } from '@hairy/react-utils'
import { Collapse } from 'antd'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface HealthConsultCollapseProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  icon?: ReactNode
}

export function HealthConsultCollapse(props: HealthConsultCollapseProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <Collapse
      className="bg-[#141414] mt-24px border-none"
      onChange={(keys) => {
        setOpen(!!keys.length)
      }}
    >
      <Collapse.Panel
        header={(
          <div className="flex justify-between items-center">
            <div className="flex-col">
              <div className="flex-center gap-1">
                <span className="line-height-none">{props.title || t('Your health advisor')}</span>
                {props.icon || <div className="i-maki-doctor" />}
              </div>
            </div>
            <span className="font-400 text-12px text-white text-opacity-50">
              {props.subtitle || t('Moonchain AI Service')}
            </span>
          </div>
        )}
        key="1"
      >
        <If cond={open}>
          {props.children}
        </If>
      </Collapse.Panel>
    </Collapse>
  )
}
