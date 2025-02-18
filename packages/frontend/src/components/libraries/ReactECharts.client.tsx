import { useRef } from 'react'
import { DetailedHTMLProps, useWatch } from '@hairy/react-utils'
import { useMount, useUnmount } from 'react-use'
import { EChartsType, init } from 'echarts'
import type { ECOption } from './ReactECharts.import'

import './ReactECharts.import'

export interface ReactEChartsProps extends DetailedHTMLProps {
  initOption?: Parameters<typeof init>[2]
  autoresize?: boolean
  option?: ECOption
  theme?: string
}

function ReactEChartsClient(props: ReactEChartsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<EChartsType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>()

  const { initOption, autoCapitalize, option, theme, ...divProps } = props

  const options = {
    ...(props.theme === 'dark' ? { backgroundColor: 'transparent' } : {}),
    ...props.option,
  }

  function observeListenResize() {
    resizeObserverRef.current?.disconnect()
    if (containerRef.current)
      resizeObserverRef.current?.observe(containerRef.current)
  }
  function disposeListenResize() {
    resizeObserverRef.current?.disconnect()
  }

  function initResizeObserver() {
    resizeObserverRef.current = new ResizeObserver(() => {
      instanceRef.current?.resize({
        width: 'auto',
        height: 'auto',
        animation: { duration: 300 },
      })
    })
  }
  function initECharts() {
    if (!containerRef.current)
      return

    instanceRef.current = init(containerRef.current, props.theme, props.initOption)
    instanceRef.current.setOption(options)

    if (props.autoresize)
      observeListenResize()
  }
  function updateECharts() {
    if (!instanceRef.current)
      return
    instanceRef.current.setOption(options)
  }

  useMount(() => {
    initResizeObserver()
    initECharts()
  })
  useWatch([props.theme, props.initOption, containerRef.current], initECharts)

  useWatch([props.option], updateECharts)

  useUnmount(disposeListenResize)

  return <div {...divProps} ref={containerRef}></div>
}

export default ReactEChartsClient
