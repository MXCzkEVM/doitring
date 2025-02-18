import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'
import { Unless } from '@hairy/react-utils'
import { Button, Result } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'

export function NonNotExistAccount(props: PropsWithChildren) {
  const { address } = useAccount()
  const { t } = useTranslation()

  return (
    <Unless cond={address} else={props.children}>
      <div className="flex-1 flex-center">
        <Result
          icon={(
            <div className="flex-center">
              <div className="i-devicon-plain-web3 text-84px" />
            </div>
          )}
          title={t('Connect your wallet to view devices')}

          subTitle={(
            <div>
              <span className="mr-4px">
                {t('New to Ethereum')}
              </span>
              <a href="https://ethereum.org/zh/wallets/" target="_blank" rel="noreferrer noopener">
                {t('Learn more about wallets')}
              </a>
            </div>
          )}

          extra={(
            <div>
              <div className="flex-center">
                <ConnectButton chainStatus={{ smallScreen: 'none' }} />
              </div>
            </div>
          )}
        />
      </div>
    </Unless>
  )
}
