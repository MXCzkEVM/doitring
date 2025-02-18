import { PropsWithChildren } from 'react'
import { If, Unless } from '@hairy/react-utils'
import { Spin } from 'antd'
import { NonNotExistGroupLoaded } from './NonNotExistGroupLoaded'
import { useProxyMiner } from '@/hooks'

export function NonNotExistGroup(props: PropsWithChildren) {
  const [{ value: miner, loading }] = useProxyMiner()

  return (
    <Spin spinning={loading}>
      <If cond={!loading} else={<div className="h-480px" />}>
        <Unless cond={miner?.group} else={props.children}>
          <NonNotExistGroupLoaded />
        </Unless>
      </If>
    </Spin>
  )
}
