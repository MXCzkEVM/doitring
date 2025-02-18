export function filterEChartsData<T>(array: T[], key: keyof T) {
  const data = array.map(d => d[key] || null) as (number | null)[]
  return data.filter(Boolean).length === 0
    ? [...data, 0]
    : data
}
