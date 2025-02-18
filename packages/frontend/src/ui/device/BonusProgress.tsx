import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export interface BonusProgressProps {
  onClick?: () => void
  cp?: number
  sc?: number
}

export function BonusProgress(props: BonusProgressProps) {
  const { t } = useTranslation()
  return (
    <div className="relative" onClick={props.onClick}>
      <div className="relative inline-block w120px h115px overflow-hidden">
        <ProgressCircle radius={120} total={400} stroke={8} progress={props.cp || 0} color="#6DFF33">
          <div className="absolute left-12% bottom-18% text-10px">0</div>
          <div className="absolute right-12% bottom-18% text-10px">400</div>
        </ProgressCircle>
        <ProgressCircle
          className="absolute top-18px right-0 left-0 flex-center"
          radius={84}
          total={100}
          stroke={12}
          progress={props.sc || 0}
          color="#FF6F6F"
        >
          <div className="absolute left-10% bottom-14% text-10px">0</div>
          <div className="absolute right-10% bottom-14% text-10px">100</div>
        </ProgressCircle>
      </div>
      <div className="flex justify-between">
        <div className="flex-center gap-4px">
          <div className="w10px h10px rounded-full bg-[#6DFF33]" />
          <span className="text-10px">CP</span>
        </div>
        <div className="flex-center gap-4px">
          <div className="w10px h10px rounded-full bg-[#FF6F6F]" />
          <span className="text-10px">
            {t('Health Score')}
          </span>
        </div>
      </div>
      <div className={classNames([
        'i-material-symbols-help text-[#D9D9D9] text-12px',
        'absolute-tr',
      ])}
      />
    </div>
  )
}

interface ProgressCircleProps {
  progress: number
  color: string
  total?: number
  stroke?: number
  radius?: number
  className?: string
}

function ProgressCircle({
  progress,
  color,
  total = 100,
  stroke = 10,
  radius = 100,
  ...otherProps
}: PropsWithChildren<ProgressCircleProps>) {
  const normalizedRadius = 50 - stroke * 0.5
  const circumference = normalizedRadius * (Math.PI * 1.4)
  const strokeProgress = progress / total
  const strokeDashoffset = circumference - strokeProgress * circumference
  return (
    <div className={otherProps.className}>
      <div className="relative inline-block">
        <i className="w-1em h-1em line-height-1em" style={{ fontSize: radius }}>
          <svg
            className="w-1em h-1em relative"
            style={{ transform: 'rotate(143.8deg)' }}
            viewBox="0 0 100 100"
          >
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              r={normalizedRadius}
              cx={50}
              cy={50}
              strokeLinecap="round"
              style={{ opacity: 0.5 }}
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference + 120}`}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={50}
              cy={50}
              strokeLinecap="round"
            />
          </svg>
        </i>
        {otherProps.children}

      </div>
    </div>

  )
}
