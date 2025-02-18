import dayjs from 'dayjs'
import { storeToState } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { store } from '@/store'
import { Day } from '@/ui/device/sleep/Day'
import { Week } from '@/ui/device/sleep/Week'
import { Month } from '@/ui/device/sleep/Month'
import { Detail } from '@/ui/device/Detail'

function Page() {
  const { t } = useTranslation()
  const data = storeToState(store.miner, 'sleeps')[0]

  return (
    <Detail
      type="sleeps"
      title={t('Sleep')}
      components={{ Day, Month, Week }}
      data={data}
      tip="/device/sleep/tip"
    />
  )
}

export default Page
