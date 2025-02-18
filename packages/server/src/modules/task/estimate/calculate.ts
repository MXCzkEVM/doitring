export function sleepScore(seconds: number) {
  // 将睡眠时间从秒转换为小时
  const sleepTimeInHours = seconds / 3600

  // 建议睡眠时间为 8 小时
  const recommendedSleepTime = 8

  // 计算睡眠时间与建议睡眠时间的差值
  const timeDifference = Math.abs(sleepTimeInHours - recommendedSleepTime)

  // 根据差值确定评分的减分情况
  let score = 100 - (timeDifference * 10) // 每小时差距扣除 10 分

  // 分数不能低于 0 分
  score = Math.max(score, 0)

  return score
}

export function deepSleepScore(seconds: number) {
  const min = 5760
  const max = 11520
  const poi = 10

  let score = 100

  if (seconds >= min && seconds <= max)
    return score

  if (seconds < min) {
    const difference = ((min - seconds) / min) * 100
    score -= Math.ceil(difference / 10) * poi
  }
  else if (seconds > max) {
    const difference = ((seconds - max) / max) * 100
    score -= Math.ceil(difference / 10) * poi
  }
  return score < 0 ? 0 : score
}

export function lightSleepScore(seconds: number) {
  const min = 17280
  const max = 23040
  const poi = 10

  let score = 100

  if (seconds >= min && seconds <= max)
    return score

  if (seconds < min) {
    const difference = ((min - seconds) / min) * 100
    score -= Math.ceil(difference / 10) * poi
  }
  else if (seconds > max) {
    const difference = ((seconds - max) / max) * 100
    score -= Math.ceil(difference / 10) * poi
  }
  return score < 0 ? 0 : score
}
