import { deepSleepScore, lightSleepScore, sleepScore } from './calculate'
import { average, percentage } from './number'
import { riposte } from './util'

export interface Data {
  value: number
  date: number
}

export function estimateSleeps(data: Data[]) {
  const durations = {
    dep: data.filter(d => d.value === 1).length * 60,
    lig: data.filter(d => d.value === 2).length * 60,
    rem: data.filter(d => d.value === 3).length * 60,
    act: data.filter(d => d.value <= 3).length * 60,
    tol: data.length * 60,
  }

  const standard = 28800
  const percents = {
    dep: percentage(standard, durations.dep, 0),
    lig: percentage(standard, durations.lig, 0),
    rem: percentage(standard, durations.rem, 0),
  }

  const scores = {
    lig: lightSleepScore(durations.lig),
    dep: deepSleepScore(durations.dep),
    dur: sleepScore(durations.act),
  }
  const score = Number(average([scores.dep, scores.dur, scores.lig]).toFixed(0))

  const evals = {
    com: riposte(
      [score > 85, 'good' as const],
      [score > 60, 'normal' as const],
      [true, 'poor' as const],
    )!,
    dep: riposte(
      [percents.dep > 20 && percents.dep < 40, 'normal' as const],
      [percents.dep < 20, 'low' as const],
      [percents.dep > 40, 'high' as const],
    )!,
    lig: riposte(
      [percents.lig > 60 && percents.lig < 80, 'normal' as const],
      [percents.lig < 60, 'low' as const],
      [percents.lig > 80, 'high' as const],
    )!,
    rem: riposte(
      [percents.rem > 10 && percents.rem < 30, 'normal' as const],
      [percents.rem < 10, 'low' as const],
      [percents.rem > 30, 'high' as const],
    )!,
  }

  return {
    durations,
    percents,
    scores,
    score,
    evals,
  }
}

export function estimateSteps(data: Data[]) {
  const total = data.map(d => d.value).reduce((a, b) => a + b, 0)
  const score = percentage(10000, total >= 1000 ? total : 0)
  return {
    total,
    score,
  }
}

export function estimateOxygens(data: Data[]) {
  const aver = average(data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const max = Math.max(...data.map(d => d.value))
  const score = aver >= 95
    ? 100
    : aver >= 80 ? 60 : 20

  const evalType = riposte(
    [aver >= 95, 'normal' as const],
    [aver >= 80, 'abnormal' as const],
    [true, 'danger' as const],
  )!

  return {
    eval: evalType,
    average: aver.toFixed(2),
    min,
    max,
    score,
  }
}

export function estimateRates(data: Data[]) {
  const aver = average(data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const max = Math.max(...data.map(d => d.value))
  const score = 100
  const type = aver > 25 && aver < 200
    ? 'normal'
    : 'abnormal'
  return {
    eval: type as 'normal' | 'abnormal',
    average: aver.toFixed(2),
    min,
    max,
    score,
  }
}
