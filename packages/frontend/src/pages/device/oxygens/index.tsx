import { useTranslation } from 'react-i18next'
import { storeToState } from '@hairy/react-utils'
import { store } from '@/store'
import { Day } from '@/ui/device/oxygens/Day'
import { Week } from '@/ui/device/oxygens/Week'
import { Month } from '@/ui/device/oxygens/Month'
import { Detail } from '@/ui/device/Detail'

function Page() {
  const { t } = useTranslation()
  const data = storeToState(store.miner, 'oxygens')[0]

  return (
    <Detail
      type="oxygens"
      title={t('Blood oxygen')}
      components={{ Day, Month, Week }}
      data={data}
      tip="/device/oxygens/tip"
    />
  )
}

export default Page
