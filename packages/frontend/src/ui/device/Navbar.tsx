/* eslint-disable ts/no-unsafe-function-type */
import classNames from 'classnames'
import { useRouter } from 'next/router'

export function Navbar(props: { title: string, onClickTip?: Function }) {
  const router = useRouter()
  return (
    <div className="px-24px py-12px flex items-center justify-between mb-12px">
      <div
        className="i-material-symbols-arrow-back-rounded text-24px"
        onClick={() => router.replace('/device')}
      />
      <span className="text-18px font-bold">{props.title}</span>
      <div
        className={classNames(['i-material-symbols-help text-24px', !props.onClickTip && 'text-black'])}
        onClick={() => props.onClickTip?.()}
      />
    </div>
  )
}
