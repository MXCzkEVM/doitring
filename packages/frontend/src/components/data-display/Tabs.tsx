/* eslint-disable ts/no-unused-expressions */
import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState } from 'react'
import TabsModule from './Tabs.module.scss'

export interface TabsProps {
  options?: { label: ReactNode, value: string | number, children?: ReactNode }[]
  value?: string | number
  onChange?: (value: any) => void
  className?: string
}

export function Tabs(props: TabsProps) {
  const [value, setValue] = useState<string | number | undefined>(props.value || props.options?.[0].value)
  const [offset, setOffset] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)
  const options = props.options || []
  const tabsRef = useRef<HTMLDivElement>()

  function onChange(newValue: string | number) {
    if (!('value' in props))
      setValue(newValue)
    props.onChange?.(newValue)
  }

  const target = 'value' in props
    ? props.value
    : value

  function watchOffset() {
    const index = options.findIndex(o => o.value === target)
    index === -1
      ? setOffset(-itemWidth)
      : setOffset(index * itemWidth)
  }

  function watchWidth() {
    if (!options.length)
      return
    setItemWidth(tabsRef.current?.children[0].clientWidth || 0)
  }

  useEffect(watchOffset, [target, itemWidth])
  useEffect(watchWidth, [target])

  return (
    <>
      <div className={classNames(['p-1.5 bg-[#1c1c1c] rounded-25px', props.className])}>
        <div
          ref={tabsRef as any}
          className={classNames([
            'rounded-25px h-32px bg-[#1c1c1c] overflow-hidden flex',
            typeof target !== 'undefined' && TabsModule['cus-tabs'],
          ])}
          style={{
            '--block-offset': `${offset}px`,
            '--block-width': `${itemWidth}px`,
          } as any}
        >
          {options.map(opt => (
            <div
              className={classNames([
                'flex-1 flex-center h-full relative z-1 transition-color duration-300',
                target === opt.value
                  ? 'text-white'
                  : 'text-[#7E8088]',
              ])}
              onClick={() => onChange(opt.value)}
              key={opt.value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10px">
        {options.find(v => v.value === target)?.children}
      </div>
    </>
  )
}
