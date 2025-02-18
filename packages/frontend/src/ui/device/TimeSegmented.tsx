import { Button, Segmented } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

export interface TimeSegmentedProps {
  onChange: (value: string) => void
  value: string
}
export function TimeSegmented(props: TimeSegmentedProps) {
  return (
    <div className="mx-24px">
      <Segmented<string>
        options={[
          { value: 'd', label: 'Daily' },
          { value: 'w', label: 'Weekly' },
          { value: 'M', label: 'Monthly' },
        ]}
        onChange={props.onChange}
        value={props.value}
        block
      />
    </div>
  )
}
