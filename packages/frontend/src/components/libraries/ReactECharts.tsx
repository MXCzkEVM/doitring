import dynamic from 'next/dynamic'
import type { ReactEChartsProps } from './ReactECharts.client'
import type { ECOption } from './ReactECharts.import'

export const ReactECharts = dynamic(
  () => import('./ReactECharts.client'),
  { ssr: false },
)
export { ReactEChartsProps, ECOption }
