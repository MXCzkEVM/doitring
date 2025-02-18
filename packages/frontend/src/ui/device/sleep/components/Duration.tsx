import { If } from '@hairy/react-utils'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useTranslation } from 'react-i18next'

export interface DurationProps {
  date?: number
  className?: string
}

dayjs.extend(duration)

export function Duration(props: DurationProps) {
  const dur = dayjs.duration(props.date || 0, 'seconds')
  const { t } = useTranslation()

  return (
    <span className={props.className}>
      <span className="font-bold">
        {' '}
        {props.date ? dur.hours() : '-'}
        {' '}
      </span>
      <span>{t('hour')}</span>

      <span className="font-bold">
        {' '}
        {props.date ? dur.minutes() : '-'}
        {' '}
      </span>
      <span>{t('minute')}</span>
    </span>
  )
}
