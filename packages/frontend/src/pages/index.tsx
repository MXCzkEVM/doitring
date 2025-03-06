import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { useOverlayInject } from '@overlastic/react'
import { If, useWhenever } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { FingerMeasurementDialog } from '@/components/dialog/FingerMeasurement'
import Layout from '@/layout'
import { useProxyMiner } from '@/hooks'
import { ViewRingStarted } from '@/ui/home/ViewRingStarted'
import { ViewRingRegister } from '@/ui/home/ViewRingRegister'
import { ViewRingTutorial } from '@/ui/home/ViewRingTutorial'

function Page() {
  const router = useRouter()

  const [tab, setTab] = useState('ViewRingStarted')

  const { value: miner, loading } = useProxyMiner()[0]
  const { isConnected } = useAccount()

  const dialog = useOverlayInject(FingerMeasurementDialog)
  useWhenever(router.query.measure, () => dialog())

  return (
    <div style={{ fontFamily: 'Anaheim-Regular' }}>
      <If cond={!loading}>
        <If
          cond={!miner || !isConnected}
          else={<ViewRingTutorial />}
        >
          <If
            cond={tab === 'ViewRingStarted'}
            then={<ViewRingStarted onStart={() => setTab('ViewRingRegister')} />}
            else={<ViewRingRegister onBack={() => setTab('ViewRingStarted')} />}
          />
        </If>
      </If>
    </div>
  )
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: true }}
      tabbarProps={{ miner: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
