import { useTranslation } from 'react-i18next'
import { storeToState } from '@hairy/react-utils'
import { store } from '@/store'
import { Day } from '@/ui/device/steps/Day'
import { Week } from '@/ui/device/steps/Week'
import { Month } from '@/ui/device/steps/Month'
import { Detail } from '@/ui/device/Detail'

function Page() {
  const { t } = useTranslation()
  const data = storeToState(store.miner, 'steps')[0]

  return (
    <Detail
      type="steps"
      title={t('Stepss')}
      components={{ Day, Month, Week }}
      data={data}
      tip="/device/steps/tip"
    />
  )
}

export default Page
