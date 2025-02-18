import { Unless, storeToState } from '@hairy/react-utils'
import { PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Result } from 'antd'
import { useProxyBluetooth } from '@/hooks'
import { store } from '@/store'

export function NonNotExistBluetooth(props: PropsWithChildren) {
  const [miner] = storeToState(store.miner, 'miner')
  const [{ value: { bluetooth }, loading }, fetchBluetooth] = useProxyBluetooth()
  const { t } = useTranslation()

  const isIncorrectDevice = useMemo(
    () => bluetooth?.name !== miner?.sncode,
    [miner, bluetooth],
  )

  const isConnected = bluetooth && miner && !isIncorrectDevice

  return (
    <Unless cond={isConnected} else={props.children}>
      <Result
        className="py-12px"
        icon={(
          <div className="flex-center">
            <div className="i-clarity-disconnect-line text-64px" />
          </div>
        )}
        title={t('The ring is currently not connected')}
        subTitle={t('Click the button to connect the device')}
        extra={(
          <div className="flex-center">
            <Button
              loading={loading}
              onClick={() => {
                fetchBluetooth({ filters: [{ name: miner?.sncode }] })
              }}
            >
              {t('Connect Ring')}
            </Button>
          </div>
        )}
      />
    </Unless>
  )
}
