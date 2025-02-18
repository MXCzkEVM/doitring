import { If } from '@hairy/react-utils'
import { Card } from 'antd-mobile'
import { ReactNode } from 'react'

export interface StepCardProps {
  title: ReactNode
  subtitle: ReactNode
  describe: ReactNode
  footer?: ReactNode
  icon?: ReactNode
}

export function StepCard(props: StepCardProps) {
  return (
    <Card title={props.title} className="mx-18px min-h-300px">
      <div className="flex-center mt-14px mb-28px mx-auto rounded-16px w-94px h-94px bg-primary">
        {props.icon}
      </div>
      <div className="text-14px font-bold text-primary mb-6px">
        {props.subtitle}
      </div>
      <div className="text-14px">
        {props.describe}
      </div>
      <If cond={props.footer}>
        <div className=" pt-10px mt-10px flex justify-end border-t border-t-solid border-0.5px border-[var(--adm-color-border)]">
          {props.footer}
        </div>
      </If>
    </Card>
  )
}
