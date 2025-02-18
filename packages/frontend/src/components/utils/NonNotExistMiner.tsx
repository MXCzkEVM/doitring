import { If, Unless } from '@hairy/react-utils'
import { Result, Spin } from 'antd'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useProxyMiner } from '@/hooks'

export function NonNotExistMiner(props: PropsWithChildren) {
  const [{ value: miner, loading }] = useProxyMiner()
  const { t } = useTranslation()

  return (
    <Spin spinning={loading}>
      <If cond={!loading} else={<div className="h-480px" />}>
        <Unless cond={miner} else={props.children}>
          <Result
            icon={(
              <div className="flex-center">
                <div className="i-tabler-device-imac-exclamation text-84px" />
              </div>
            )}
            title={t('There are currently no devices available for viewing')}
            subTitle={t('Click on the top right corner to add a device')}
          />
        </Unless>
      </If>
    </Spin>
  )
}
