import { Button, ButtonProps } from 'antd'
import { useState } from 'react'
import { Button as MButton } from 'antd-mobile'

export interface ButtonWithLoadingProps extends ButtonProps {
  mobile?: boolean
}
export function ButtonWithLoading(props: ButtonWithLoadingProps) {
  const [loading, setLoading] = useState(false)
  function onClick(event: any) {
    const promise = props.onClick?.(event) as any
    if (promise instanceof Promise) {
      setLoading(true)
      promise.finally(() => setLoading(false))
    }
  }

  return props.mobile
    ? <MButton {...props as any} onClick={onClick} loading={props.loading || loading} />
    : <Button {...props} onClick={onClick} loading={props.loading || loading} />
}
