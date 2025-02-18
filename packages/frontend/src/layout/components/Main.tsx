import { PropsWithChildren } from 'react'
import { DetailedHTMLProps } from '@hairy/react-utils'
import classNames from 'classnames'

function Main(props: PropsWithChildren<DetailedHTMLProps>) {
  return (
    <div className={classNames([props.className, 'w-full h-full flex-1 flex-col'])}>
      {props.children}
    </div>
  )
}

export default Main
