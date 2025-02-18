/* eslint-disable no-empty-pattern */
import { Button, Flex } from 'antd'
import { useProxyBluetoothCommand } from '@/hooks'

export function CommandPanel() {
  const [{}, fetchReadLevel] = useProxyBluetoothCommand('readLevel')
  const [{}, fetchReadTime] = useProxyBluetoothCommand('readTime')
  const [{}, fetchReadVersion] = useProxyBluetoothCommand('readVersion')
  const [{}, fetchReadSleep] = useProxyBluetoothCommand('readSleep')
  const [{}, fetchReadSteps] = useProxyBluetoothCommand('readSteps')
  const [{}, fetchReadHeartRates] = useProxyBluetoothCommand('readHeartRates')
  const [{}, fetchReadBloodOxygens] = useProxyBluetoothCommand('readBloodOxygens')
  return (
    <Flex className="mt-28px" wrap gap="small">
      <Button onClick={() => fetchReadLevel()}>
        Read Level
      </Button>
      <Button onClick={() => fetchReadSleep()}>
        Read Sleep
      </Button>
      <Button onClick={() => fetchReadTime()}>
        Read Time
      </Button>
      <Button onClick={() => fetchReadSteps()}>
        Read Step Total
      </Button>
      <Button onClick={() => fetchReadHeartRates()}>
        Read Heart Rate
      </Button>
      <Button onClick={() => fetchReadBloodOxygens()}>
        Read Blood Oxygen
      </Button>
      <Button onClick={() => fetchReadVersion()}>
        Read Version
      </Button>
    </Flex>
  )
}
