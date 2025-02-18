import { PropsWithChildren } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { Unless, useAsyncCallback } from '@hairy/react-utils'
import { Button, Result } from 'antd'
import { } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'

export function NonNotExistChain(props: PropsWithChildren) {
  const chainId = useChainId()
  const { switchChainAsync: _switchChainAsync, chains } = useSwitchChain()
  const { t } = useTranslation()
  const [loading, switchChain] = useAsyncCallback(_switchChainAsync)
  return (
    <Unless cond={[18686, 5167004].includes(chainId)} else={props.children}>
      <div className="flex-1 flex-center">
        <Result
          icon={(
            <div className="flex-center">
              <div className="i-carbon-content-delivery-network text-84px" />
            </div>
          )}
          title={t('Network incorrect')}
          subTitle={t('Current page only supports Moonchain chains')}

          extra={(
            <div>
              <div className="flex-center">
                <Button
                  type="primary"
                  onClick={() => switchChain({ chainId: chains[0].id })}
                  loading={loading}
                >
                  {t('Switch Chain')}
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    </Unless>
  )
}
