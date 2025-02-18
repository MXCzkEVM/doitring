import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function Card(props: PropsWithChildren<{ className?: string }>) {
  return (
    <div {...props} className={classNames(['p10px rounded-5px bg-[#141414]', props.className])}>
      {props.children}
    </div>
  )
}
