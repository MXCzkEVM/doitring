/* eslint-disable no-empty-pattern */
import { ReactNode, useState } from 'react'
import { useMount } from 'react-use'
import { useEventBus } from '@hairy/react-utils'
import { contracts } from '@harsta/client'
import { useAccount } from 'wagmi'
import { Button } from 'antd'
import Layout from '@/layout'
import {
  NonNotExistAccount,
  NonNotExistMiner,
  Tabs,
} from '@/components'

import { useProxyBluetooth, useProxyMiner } from '@/hooks'

import { Staking } from '@/ui/rewards/Staking'
import { Device } from '@/ui/device/Device'

function Page() {
  const items = [
    { value: 'claim', label: 'Claim', children: <Device /> },
    { value: 'staking', label: 'Staking', children: <Staking /> },
  ]
  const [tab, setTab] = useState('claim')
  const [{}, fetchBluetooth] = useProxyBluetooth()
  const [{ value: miner }] = useProxyMiner()
  const { on: onChangeTabStaking } = useEventBus('device:tabs')

  useMount(async () => {
    try {
      await fetchBluetooth({ filters: [{ name: miner?.sncode }] })
    }
    catch {}
  })

  onChangeTabStaking(() => setTab('staking'))

  return (
    <NonNotExistAccount>
      <NonNotExistMiner>
        <div className="px-17px">
          <Tabs value={tab} onChange={setTab} options={items} />
        </div>
      </NonNotExistMiner>
    </NonNotExistAccount>
  )
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
