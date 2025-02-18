import { useTranslation } from 'react-i18next'
import { StatisticsSleeps } from './StatisticsSleeps'
import { StatisticsRates } from './StatisticsRates'
import { StatisticsSteps } from './StatisticsSteps'
import { StatisticsBloods } from './StatisticsBloods'

export function Statistics() {
  const { t } = useTranslation()

  return (
    <>
      <h2 className="mb-6">
        {t('Statistics')}
      </h2>
      <div className="grid grid-cols-2 gap-12px">
        <StatisticsSleeps />
        <StatisticsRates />
        <StatisticsSteps />
        <StatisticsBloods />
      </div>
    </>
  )
}
