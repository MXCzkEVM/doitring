import { ReactEventHandler } from 'react'
import { useVideo } from 'react-use'
import { useTranslation } from 'react-i18next'

export interface FingerMeasurementTutorialProps {
  onEnded?: ReactEventHandler<HTMLVideoElement> | undefined
}
export function FingerMeasurementTutorial(props: FingerMeasurementTutorialProps) {
  const { t } = useTranslation()
  const [video] = useVideo(
    <video className="w-full" src="/tutorial.mp4" autoPlay onEnded={props.onEnded} />,
  )

  return (
    <div>
      <div className="flex-col gap-2px mb-12px">
        <div>
          1.
          {t('Tutorial Row 1')}
        </div>
        <div>
          2.
          {t('Tutorial Row 2')}
        </div>
        <div>
          3.
          {t('Tutorial Row 3')}
        </div>
        <div>
          4.
          {t('Tutorial Row 4')}
        </div>
        <div>
          5.
          {t('Tutorial Row 5')}
        </div>
      </div>
      <div className="w-full overflow-hidden rounded relative">
        {video}
        <div className="absolute z-10 inset-0" />
      </div>
    </div>
  )
}
