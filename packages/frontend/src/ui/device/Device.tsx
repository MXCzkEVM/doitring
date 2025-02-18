/* eslint-disable no-empty-pattern */
import { ReactNode, useMemo } from 'react'

import { If, useWhenever } from '@hairy/react-utils'
import { List } from 'antd'
import Layout from '@/layout'
import {
  HealthConsult,
  HealthFortuneTeller,
  NonNotExistAccount,
  NonNotExistChain,
  NonNotExistMiner,
} from '@/components'

import { StatusBar } from '@/ui/device/StatusBar'
import { Statistics } from '@/ui/device/Statistics'
import { ClaimSteps } from '@/ui/device/ClaimSteps'
import { ComputingPower } from '@/ui/device/ComputingPower'
import { useProxyBluetooth, useProxyMiner } from '@/hooks'

export function Device() {
  const [{ value: miner }] = useProxyMiner()

  const [{}, fetchBluetooth] = useProxyBluetooth()

  useWhenever(miner, async () => {
    try {
      await fetchBluetooth({
        filters: [{ name: miner?.sncode }],
      })
    }
    catch {}
  })
  return (
    <NonNotExistAccount>
      <NonNotExistChain>
        <NonNotExistMiner>
          <div className="my-12px">
            <StatusBar />
            <ClaimSteps />
            <HealthFortuneTeller />
            <Statistics />
            <ComputingPower />
          </div>
        </NonNotExistMiner>
      </NonNotExistChain>
    </NonNotExistAccount>
  )
}
