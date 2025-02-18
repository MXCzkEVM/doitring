import { useTranslation } from 'react-i18next'
import { storeToState } from '@hairy/react-utils'
import { store } from '@/store'
import { Day } from '@/ui/device/rates/Day'
import { Week } from '@/ui/device/rates/Week'
import { Month } from '@/ui/device/rates/Month'
import { Detail } from '@/ui/device/Detail'

function Page() {
  const { t } = useTranslation()
  const data = storeToState(store.miner, 'rates')[0]

  return (
    <Detail
      type="rates"
      title={t('Heart Rate')}
      components={{ Day, Month, Week }}
      data={data}
      tip="/device/rates/tip"
    />
  )
}

export default Page
