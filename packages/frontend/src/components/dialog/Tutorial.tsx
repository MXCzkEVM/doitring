import { useExtendOverlay } from '@overlastic/react'
import classNames from 'classnames'
import { ReactNode } from 'react'

export interface TutorialDialogProps {
  title: ReactNode
  image: string
  description: ReactNode
  footer?: ReactNode
}

export function TutorialDialog(props: TutorialDialogProps) {
  const { visible, reject, resolve } = useExtendOverlay({
    duration: 500,
  })
  return (
    <>
      <div
        className={classNames([
          'transition-all opacity-0 backdrop-blur-6 bg-[rgb(255,255,255,0.1)]',
          visible && '!opacity-100',
          'fixed inset-0 z-100',
          'flex-col-center',
        ])}
        onClick={() => reject()}
      >
        <div className="mx-60px relative" onClick={event => event.stopPropagation()}>
          <img className="w-full" src={props.image} />
          <div className="absolute inset-0">
            <div className="h-38px mx-10px mb-10px flex items-center">
              <div
                className="i-material-symbols-arrow-left-alt-rounded text-24px"
                onClick={() => resolve()}
              />
            </div>
            <div className="text-20px mb-10px line-height-25.78px text-center">
              {props.title}
            </div>
            <div className="text-14px line-height-18px mb-10px mx-12px text-center">
              {props.description}
            </div>
            <div className="flex-center">
              {props.footer}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
