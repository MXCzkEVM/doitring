import { Input, InputProps } from 'antd'
import { ChangeEvent, useMemo, useState } from 'react'
import { parsePhone } from '@/utils'

export interface InputPhoneNumberProps extends InputProps {
  parsed?: ReturnType<typeof parsePhone>
}

export function InputPhoneNumber(props: InputPhoneNumberProps) {
  const { parsed, onChange } = props

  function onTriggerChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e)
  }
  return <Input {...props} onChange={onTriggerChange} value={parsed?.show} />
}
