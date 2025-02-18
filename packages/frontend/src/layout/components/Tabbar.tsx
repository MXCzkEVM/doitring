import { If } from '@hairy/react-utils'
import { Badge, TabBar } from 'antd-mobile'
import { useRouter } from 'next/router'
import { useLocation } from 'react-use'
import { useProxyMiner } from '@/hooks'

export interface TabbarProps {
  miner?: boolean
}

function Tabbar(props: TabbarProps) {
  const router = useRouter()
  const location = useLocation()
  const { pathname } = location
  const [{ value: miner }] = useProxyMiner()
  const tabs = [
    {
      key: '/',
      title: 'Home',
      icon: <div className="i-material-symbols-other-houses-outline-rounded" />,
      badge: Badge.dot,
    },
    {
      key: '/rewards',
      title: 'Referral',
      icon: <div className="i-fluent-wallet-credit-card-24-regular" />,
    },
    {
      key: '/friends',
      title: 'Friends',
      icon: <div className="i-ant-design-team-outlined" />,
    },
    {
      key: '/device',
      title: 'Health',
      icon: <div className="i-solar-health-broken" />,
    },
  ]

  return (
    <If cond={!props.miner || !!miner}>
      <TabBar activeKey={pathname} className="fixed bottom-0 max-w-xl left-0 right-0 mx-auto z-10 bg-[#070A0F] bg-opacity-90" safeArea onChange={value => router.push(value)}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </If>

  )
}

export default Tabbar
