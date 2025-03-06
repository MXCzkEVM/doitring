import { Toast } from 'antd-mobile'
import { latLngToCell } from 'h3-js'
import hexagons from './hexagons.json'

export function noop(): any {}

export async function getCurrentHexagon() {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return latLngToCell(
      position.coords.latitude,
      position.coords.longitude,
      7,
    )
  }
  catch {
    return undefined
  }
}

export async function copy(text: string) {
  await navigator.clipboard.writeText(text || '')
  Toast.show({
    position: 'top',
    icon: 'success',
    content: 'Copied',
  })
}

export function parseQueryByString(query: Record<string, any>) {
  return Object.keys(query).length === 0
    ? ''
    : `?${new URLSearchParams(Object.entries(query)).toString()}`
}

export function whenever<T, C extends (value: Exclude<T, null | undefined>) => any>(value: T, callback: C): ReturnType<C> | undefined {
  return value ? callback(value as any) : undefined
}

export function arange(x1: number, x2?: number, stp = 1, z: number[] = [], z0 = z.length) {
  if (!x2)
    x1 -= x2 = x1
  for (let z1 = z0 + Math.max(Math.ceil((++x2 - x1) / stp), 0); z0 < z1; x1 += stp) z[z0++] = x1
  return z
}

export function mmToPixels(mm: number) {
  const element = document.createElement('div')
  element.style.width = '1in'
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  document.body.appendChild(element)
  let dpi = element.offsetWidth

  if (navigator.userAgent.toLowerCase().includes('mobile')) {
    dpi = dpi * 1.6
  }

  document.body.removeChild(element)

  // alert(window.visualViewport?.)
  // alert(window.screen.pixelDepth)
  return (mm / 25.4) * dpi
}

export function riposte<T>(...args: [cond: boolean, value: T][]): T {
  for (const [cond, value] of args) {
    if (cond)
      return value
  }
  return undefined as T
}

export function isMobile() {
  return typeof window !== 'undefined'
    && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || window.axs !== undefined
}
