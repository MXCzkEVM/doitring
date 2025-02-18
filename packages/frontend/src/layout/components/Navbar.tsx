import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { PropsWithChildren, ReactNode } from 'react'
import { DetailedHTMLProps, If, storeToState } from '@hairy/react-utils'
import { useAccount, useConnect } from 'wagmi'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useOverlayInject } from '@overlastic/react'
import { Badge, Button, Tag } from 'antd'
import { ButtonWithRegisterRing, JournalismDialog, UserInfo } from '@/components'
import { useProxyMiner, useProxyMinerDetail, useProxyUser } from '@/hooks'
import { store } from '@/store'

export interface NavbarProps extends PropsWithChildren<DetailedHTMLProps> {
  slots?: { right?: ReactNode }
  register?: boolean
  right?: boolean
  back?: boolean | string
  userInfo?: boolean
}

function Navbar(props: NavbarProps) {
  const { isConnected, isConnecting } = useAccount()
  const { isPending } = useConnect()
  const [{ loading: loadingByMiner, value: miner }] = useProxyMiner()
  const [{ loading: loadingByDetail }] = useProxyMinerDetail()
  const { openConnectModal } = useConnectModal()
  const [{ value: user }] = useProxyUser()

  const router = useRouter()
  const { t } = useTranslation()

  const reads = storeToState(store.config, 'reads')[0]

  const openJournalismDialog = useOverlayInject(JournalismDialog)

  const readValue = Object.values(reads || {})
  const readCount = readValue.length - readValue.filter(Boolean).length
  const isLoading = isConnecting || loadingByDetail || loadingByMiner || isPending
  return (
    <If cond={props.hidden !== true}>
      <div
        {...props}
        className={classNames([
          'px-24px py-12px flex items-center',
          props.className,
        ])}
      >

        <If
          cond={props.back}
          else={(
            <If
              cond={isConnected}
              // else={(
              //   <img className="w-28px" src="/logo.svg" />
              // )}
              then={<UserInfo />}
            />
          )}
        >
          <div
            className="flex items-center cursor-pointer"
            onClick={() => typeof props.back === 'string'
              ? router.push(props.back)
              : router.back()}
          >
            <div className="i-line-md-chevron-left text-24px" />
            <div className="font-bold text-16px">
              {t('Back')}
            </div>
          </div>
        </If>

        <div className="flex-1" />
        {props.slots?.right}

        <If cond={isConnected}>
          <Tag>
            <span className="text-14px">{user?.score || 0}</span>
            <span> CP</span>
          </Tag>

          <Badge count={readCount} dot size="small" offset={[-15, 5]}>
            <div className="i-material-symbols-breaking-news-alt-1-outline text-24px mr-12px" onClick={openJournalismDialog} />
          </Badge>
          <If cond={props.right !== false}>
            <div className="connect_button_warp flex-shrink-0">
              <If cond={isConnected && !isLoading}>
                <ConnectButton
                  accountStatus={miner?.nickname ? 'address' : 'avatar'}
                  chainStatus={{ smallScreen: 'none' }}
                />
              </If>
              <If cond={!isConnected || isLoading}>
                <Button
                  loading={isLoading}
                  type="primary"
                  shape="round"
                  onClick={openConnectModal}
                >
                  {!isLoading && 'Connect Wallet'}
                </Button>
              </If>
            </div>
            <If cond={isConnected && props.register !== false && !miner}>
              <ButtonWithRegisterRing />
            </If>
          </If>
        </If>

      </div>
    </If>
  )
}

export default Navbar
