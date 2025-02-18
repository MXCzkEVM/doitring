export function riposte<T>(...args: [cond: boolean, value: T][]) {
  for (const [cond, value] of args) {
    if (cond)
      return value
  }
}
