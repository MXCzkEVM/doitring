import { If, useWatch } from '@hairy/react-utils'
import { Button, Segmented } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export interface TimeSwitchProps {
  onChange: (value: number) => void
  value: number
  type?: 'd' | 'w' | 'M'
}

export function TimeSwitch(props: TimeSwitchProps) {
  const { type: unit = 'd' } = props
  function onChange(type: 'prev' | 'next') {
    props.onChange(type === 'prev'
      ? dayjs.unix(props.value).subtract(1, unit).unix()
      : dayjs.unix(props.value).add(1, unit).unix())
  }

  useWatch([unit], () => props.onChange(dayjs().unix()))

  const nextStartOf = dayjs.unix(props.value).add(1, unit).startOf(unit).valueOf()
  const nextDisabled = nextStartOf > dayjs().valueOf()
  return (
    <div className="mx-24px py-12px flex items-center justify-between">
      <Button onClick={() => onChange('prev')} size="small" type="text">
        <div className="i-solar-alt-arrow-left-bold-duotone text-24px" />
      </Button>
      <span className="text-[rgba(255,255,255,0.65)]">
        <If cond={unit === 'M'}>
          {dayjs.unix(props.value).format('YYYY-MM')}
        </If>
        <If cond={unit === 'w'}>
          <span>{dayjs.unix(props.value).startOf('w').format('YY/MM/DD')}</span>
          <span> - </span>
          <span>{dayjs.unix(props.value).endOf('w').format('YY/MM/DD')}</span>
        </If>
        <If cond={unit === 'd'}>
          {dayjs.unix(props.value).format('YYYY-MM-DD')}
        </If>
      </span>
      <Button
        onClick={() => onChange('next')}
        size="small"
        type="text"
        disabled={nextDisabled}
      >
        <div className="i-solar-alt-arrow-right-bold-duotone text-24px" />
      </Button>
    </div>
  )
}
