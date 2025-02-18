import { proxy } from 'valtio'
import { mittWithOnce } from '@/utils'
/// <reference types="web-bluetooth" />

export const bluetooth = proxy({
  bluetooth: undefined as undefined | BluetoothDevice,
  server: undefined as undefined | BluetoothRemoteGATTServer,
  service: undefined as undefined | BluetoothRemoteGATTService,
  characteristic: undefined as undefined | BluetoothRemoteGATTCharacteristic,
  emitter: mittWithOnce<Record<string, Event>>(),
  loading: false,
})
