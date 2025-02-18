import classNames from 'classnames'
import { If } from '@hairy/react-utils'
import { colord } from 'colord'

export interface ProgressWithRangeProps {
  range?: [number, number]
  percent?: number
  color?: string
  showRange?: boolean
}

export function ProgressWithRange(props: ProgressWithRangeProps) {
  const percent = props.percent || 0
  const showRange = props.range && props.showRange !== false
  const { r, g, b } = colord(props.color || '#fff').toRgb()

  return (
    <div className={classNames(['relative', showRange && 'pb-18px'])}>
      <div className="relative h-18px">
        <div
          style={{ width: `${percent}%`, background: `rgb(${[r, g, b]})` }}
          className="rounded-12 transition-all duration-500 absolute left-0 top-0 h-full"
        />
        <div className="absolute h-full flex items-center text-14px ml-6px">
          {`${percent}%`}
        </div>
        <div
          className={classNames([
            props.showRange ? 'opacity-100' : 'opacity-0',
            'absolute h-full z-1 duration-500',
          ])}
          style={{
            width: `${props.range![1] - props.range![0]}%`,
            left: `${props.range![0]}%`,
          }}
        >
          <div
            className="absolute-lt -top-2px -bottom-2px w-2px rounded-10"
            style={{ background: `rgb(${[r, g, b]})` }}
          />
          <div
            style={{
              backgroundImage: `repeating-linear-gradient(
                          -45deg,
                          rgba(0,0,0,0.4) 0%,
                          rgba(0,0,0,0.4) 3%,
                          rgba(${[r, g, b]},0.8) 3%,
                          rgba(${[r, g, b]},0.8) 6%
                        `,
            }}
            className="w-full h-full bg-p"
          />
          <div
            style={{ background: `rgb(${[r, g, b]})` }}
            className="absolute-rt -top-2px -bottom-2px w-2px rounded-10"
          />
          <div className="top-100% w-full text-center text-12px h-full line-height-normal">
            {`${props.range?.[0]}%`}
            -
            {`${props.range?.[1]}%`}
          </div>
        </div>

      </div>
    </div>
  )
}
