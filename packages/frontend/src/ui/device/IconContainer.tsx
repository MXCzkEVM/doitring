import { DetailedHTMLProps } from '@hairy/react-utils'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'

export function IconContainer(props?: PropsWithChildren<DetailedHTMLProps>) {
  return (
    <div className={classNames(['w-28px h-28px rounded-full flex-center', props?.className])}>
      {props?.children}
    </div>
  )
}
