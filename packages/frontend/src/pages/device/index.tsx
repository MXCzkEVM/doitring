/* eslint-disable ts/no-unused-expressions */
/* eslint-disable no-empty-pattern */
import { ReactNode, useState } from 'react'
import { useMount } from 'react-use'
import { useEventBus } from '@hairy/react-utils'
import Layout from '@/layout'
import {
  NonNotExistAccount,
  NonNotExistMiner,
  Tabs,
} from '@/components'

import { useProxyBluetooth, useProxyMiner } from '@/hooks'

import { Staking } from '@/ui/rewards/Staking'
import { Device } from '@/ui/device/Device'
import { noop } from '@/utils'

function Page() {
  const items = [
    { value: 'claim', label: 'Claim', children: <Device /> },
    { value: 'staking', label: 'Staking', children: <Staking /> },
  ]
  const [tab, setTab] = useState('claim')

  const onChangeTabStaking = useEventBus('device:tabs').on
  onChangeTabStaking(() => setTab('staking'))

  return (
    <NonNotExistAccount>
      <NonNotExistMiner>
        <MountLoadedBluetooth />
        <div className="px-17px">
          <Tabs value={tab} onChange={setTab} options={items} />
        </div>
      </NonNotExistMiner>
    </NonNotExistAccount>
  )
}

function MountLoadedBluetooth() {
  const [{}, fetchBluetooth] = useProxyBluetooth()
  const [{ value: miner }] = useProxyMiner()
  useMount(async () => {
    const options = { filters: [{ name: miner?.sncode }] }
    miner && fetchBluetooth(options).catch(noop)
  })
  return null
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
