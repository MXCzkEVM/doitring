import { ReactNode } from 'react'
import { HealthConsultCollapse } from './HealthConsult.collapse'
import { HealthConsultContent } from './HealthConsult.content'

export interface HealthConsultProps {
  type: 'fortuneTeller' | 'sleeps' | 'rates' | 'steps' | 'oxygens'
  date: 'd' | 'w' | 'M'
  icon?: ReactNode
  title?: string
  subtitle?: string
  content?: ReactNode
}

export function HealthConsult(props: HealthConsultProps) {
  return (
    <HealthConsultCollapse title={props.title} subtitle={props.subtitle} icon={props.icon}>
      {props.content || <HealthConsultContent type={props.type} date={props.date} />}
    </HealthConsultCollapse>
  )
}

export { HealthConsultContent } from './HealthConsult.content'
export type { HealthConsultContentProps } from './HealthConsult.content'
