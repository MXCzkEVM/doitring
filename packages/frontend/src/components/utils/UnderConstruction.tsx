import { Result } from 'antd'
import classNames from 'classnames'

export function UnderConstruction(props: any) {
  return (
    <div className={classNames('flex-center', props.className)}>
      <Result
        icon={(
          <div className="flex-center">
            <div className="i-custom:under-development text-140px" />
          </div>
        )}
        title={<span className="text-white">System maintenance in progress</span>}
        subTitle={<span className="text-blueGray">please wait a moment</span>}
      />
    </div>
  )
}
