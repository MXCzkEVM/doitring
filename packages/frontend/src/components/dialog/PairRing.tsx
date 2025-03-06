import { useExtendOverlay } from '@overlastic/react'
import { Button, Drawer } from 'antd'
import { useTranslation } from 'react-i18next'
import { useProxyBluetooth, useProxyMiner } from '@/hooks'

export function PairRingDrawer() {
  const { resolve, visible, reject } = useExtendOverlay({
    duration: 300,
  })
  const [{ loading }, fetchBluetooth] = useProxyBluetooth()
  const [{ value: miner }] = useProxyMiner()
  const { t } = useTranslation()

  async function pair() {
    await fetchBluetooth({ filters: [{ name: miner?.sncode }] })
    resolve()
  }
  return (
    <Drawer
      className="max-w-xl mx-auto"
      title={t('Pair your Ring')}
      placement="bottom"
      open={visible}
      onClose={() => !loading && reject()}
      height="240px"
    >
      <div className="flex-col justify-between h-full">
        <p>{t('Pair Message')}</p>
        <div className="flex-center">
          <Button
            className="w-full"
            type="primary"
            onClick={pair}
            loading={loading}
          >
            {t('Start Pairing')}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
