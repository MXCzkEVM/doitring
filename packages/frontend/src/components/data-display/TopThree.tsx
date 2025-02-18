import { ReactNode } from 'react'
import { If } from '@hairy/react-utils'
import { Avatar } from './Avatar'

export interface TopThreeProps<T = any> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function TopThree<T extends Record<string, any>>(props: TopThreeProps<T>) {
  return (
    <div className="flex justify-between mb-24px mx-40px">
      <div className="flex-col justify-end items-center relative">
        <div className="inline relative">
          <div className="i-mdi-crown text-bluegray rotate-45 absolute -right-6px -top-6px" />
          <Avatar className="w-40px h-40px mb-8px" src={props.items[1]?.avatar} />
        </div>
        <div className="flex-col-center h-30px">
          <If cond={props.items[1]} else="--">
            {props.renderItem(props.items[1])}
          </If>
        </div>
      </div>
      <div className="flex-col justify-end items-center relative">
        <div className="i-mdi-crown text-24px text-amber rotate-45 absolute -right-12px -top-12px" />
        <Avatar className="w-60px h-60px mb-8px" src={props.items[0]?.avatar} />
        <div className="flex-col-center h-30px">
          <If cond={props.items[0]} else="--">
            {props.renderItem(props.items[0])}
          </If>
        </div>
      </div>
      <div className="flex-col justify-end items-center">
        <div className="inline relative">
          <div className="i-mdi-crown text-orange rotate-45 absolute -right-6px -top-6px" />
          <Avatar className="w-40px h-40px mb-8px" src={props.items[1]?.avatar} />
        </div>
        <div className="flex-col-center h-30px">
          <If cond={props.items[2]} else="--">
            {props.renderItem(props.items[2])}
          </If>
        </div>
      </div>
    </div>
  )
}
