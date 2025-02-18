import { If, useAsyncCallback } from '@hairy/react-utils'
import { Button, Input } from 'antd'
import { useMount } from 'react-use'
import { getCurrentHexagon } from '@/utils'

export interface LocationProps {
  value?: string
  onChange?: (value: string) => void
}
export function Location(props: LocationProps) {
  const [loading, callback] = useAsyncCallback(async () => {
    const hexagon = await getCurrentHexagon()
    if (hexagon)
      props.onChange?.(hexagon)
  })

  useMount(callback)
  return (
    <If
      cond={props.value}
      then={(
        <div className="flex items-center gap-1">
          <Input value={props.value} disabled />
        </div>
      )}
      else={(
        <Button loading={loading}>
          Authorize
        </Button>
      )}
    />
  )
}
