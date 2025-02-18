import { cellToLatLng } from 'h3-js'
import { storage } from '../storage'
import { Location } from './hexagon.type'

const baseURL = 'https://nominatim.openstreetmap.org/reverse.php'

export async function parseHexagon(hexagon: string) {
  let detail: Location
  if (await storage.hasItem(hexagon))
    detail = await storage.getItem<Location>(hexagon)

  if (!detail) {
    const coordPairs = cellToLatLng(hexagon).map(String)
    const params = { lat: coordPairs[0], lon: coordPairs[1], zoom: '18', format: 'jsonv2' }
    const suffix = `?${new URLSearchParams(Object.entries(params)).toString()}`
    const response = await fetch(`${baseURL}${suffix}`)
    const location = await response.json() as Location
    await storage.setItem(hexagon, location)
    detail = location
  }

  return detail
}
