import { Button } from 'antd'
import { useState } from 'react'
import classNames from 'classnames'
import { Tabs } from '../data-display'
import { mmToPixels } from '@/utils'

export interface FingerMeasurementContentProps {
  value: number
  onChange: (value: number) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const sizes = [
  { label: '6', value: 16.5 },
  { label: '7', value: 17.4 },
  { label: '8', value: 18.2 },
  { label: '9', value: 19 },
  { label: '10', value: 19.9 },
  { label: '11', value: 20.7 },
  { label: '12', value: 21.5 },
  { label: '13', value: 22.3 },
]

export function FingerMeasurementContent(props: FingerMeasurementContentProps) {
  const [direction, setDirection] = useState('left')

  const index = sizes.findIndex(s => s.value === props.value)
  const fasted = index === 0
  const lasted = index === sizes.length - 1

  function next() {
    if (lasted)
      return
    props.onChange(sizes[index + 1].value)
  }
  function prev() {
    if (fasted)
      return
    props.onChange(sizes[index - 1].value)
  }

  return (
    <>
      <Tabs
        onChange={setDirection}
        options={[
          {
            label: (
              <div className="flex-center gap-4px font-bold">
                <span>left</span>
                <div className="i-ic-twotone-back-hand rotate-y-180deg" />
              </div>
            ),
            value: 'left',
          },
          {
            label: (
              <div className="flex-center gap-4px font-bold">
                <span>right</span>
                <div className="i-ic-twotone-back-hand" />
              </div>
            ),
            value: 'right',
          },
        ]}
      />
      <div className="my-24px mx-48px flex items-center justify-between gap-12px ">
        <Button shape="circle" onClick={prev}>
          <div className="i-heroicons-solid-minus" />
        </Button>

        <span className="font-bold text-18px">
          <span>{sizes[index].label}</span>
          <span className="mx-1">|</span>
          <span>
            {props.value}
            mm
          </span>
        </span>

        <Button shape="circle" onClick={next}>
          <div className="i-heroicons-solid-plus" />
        </Button>
      </div>
      <div className={classNames(['flex my-48px w-60% mx-auto', direction === 'right' && 'justify-end'])}>
        <div
          style={{ width: `${mmToPixels(props.value)}px` }}
          className="border-l-solid border-r-solid h-50vh"
        />
      </div>
    </>
  )
}
