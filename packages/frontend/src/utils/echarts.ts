import { ECOption } from '@/components'

export function seriesWithBorder(series: ECOption['series'] = []) {
  const _series: any = series
  const stackInfo: any = {}
  for (let i = 0; i < _series[0].data.length; ++i) {
    for (let j = 0; j < _series.length; ++j) {
      const stackName = _series[j].stack
      if (!stackName) {
        continue
      }
      if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
          stackStart: [],
          stackEnd: [],
        }
      }
      const info = stackInfo[stackName]
      const data = _series[j].data[i]
      if (data && data !== '-') {
        if (info.stackStart[i] == null) {
          info.stackStart[i] = j
        }
        info.stackEnd[i] = j
      }
    }
  }
  for (let i = 0; i < _series.length; ++i) {
    const data = _series[i].data
    const info = stackInfo[_series[i].stack]
    for (let j = 0; j < _series[i].data.length; ++j) {
      // const isStart = info.stackStart[j] === i;
      const isEnd = info.stackEnd[j] === i
      const topBorder = isEnd ? 20 : 0
      const bottomBorder = 0
      data[j] = {
        value: data[j],
        itemStyle: {
          borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder],
        },
      }
    }
  }
  return series
}
