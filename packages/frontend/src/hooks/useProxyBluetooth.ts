import { storeToState } from '@hairy/react-utils'
import { useSnapshot } from 'valtio'
import mitt from 'mitt'
import { storeToStates } from './storeToStates'
import { store } from '@/store'

export const event = mitt()

export function useProxyBluetooth() {
  const {
    bluetooth: [bluetooth, setBluetooth],
    loading: [loading, setLoading],
    characteristic: [_, setCharacteristic],
    emitter: [emitter],
  } = storeToStates(store.bluetooth)

  const [miner] = storeToState(store.miner, 'miner')

  const BluetoothServiceUUID = '0000fff0-0000-1000-8000-00805f9b34fb'
  const BluetoothCharacteristicUUID = '0000fff6-0000-1000-8000-00805f9b34fb'
  const BluetoothCharacteristicNotificationUUID = '0000fff7-0000-1000-8000-00805f9b34fb'

  type Options = RequestDeviceOptions & {
    /**
     * Is the binding relationship between the identifier and NFT correct (such as tokenId)
     */
    uid?: string
  }

  function onCharacteristicResolved(event: any) {
    const dataView = event.target?.value
    const data = new Uint8Array(dataView.buffer)
    emitter.emit(`characteristicvaluechanged:${data[0]}`, event)
  }

  async function request(options: Options, setter = true) {
    const uid = Reflect.get(bluetooth || {}, 'tokenId')
    const tokenId = miner?.tokenId

    if (uid && tokenId && uid !== tokenId)
      return {}

    try {
      setLoading(true)

      const bluetooth = await navigator.bluetooth.requestDevice({
        optionalServices: [BluetoothServiceUUID],
        ...options,
      })
      const bluetoothRemoteGATTServer = await bluetooth.gatt!.connect()
      const bluetoothRemoteGATTService = await bluetoothRemoteGATTServer.getPrimaryService(BluetoothServiceUUID)

      const characteristic = await bluetoothRemoteGATTService.getCharacteristic(BluetoothCharacteristicUUID)

      await bluetoothRemoteGATTService.getCharacteristic(BluetoothCharacteristicNotificationUUID)
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => characteristic.addEventListener(
          'characteristicvaluechanged',
          onCharacteristicResolved,
        ))

      bluetooth.addEventListener('gattserverdisconnected', (event) => {
        emitter.emit('gattserverdisconnected', event)
        setBluetooth(undefined)
        setCharacteristic(undefined)
        setLoading(false)
      })

      if (options.uid)
        Reflect.set(bluetooth, 'tokenId', options.uid || miner?.tokenId)

      const outwardBluetooth: Partial<BluetoothDevice> = {
        get id() {
          return bluetooth.id
        },
        get name() {
          return bluetooth.name
        },
      }

      const outwardCharacteristic: Partial<BluetoothRemoteGATTCharacteristic > = {
        writeValue: (value: BufferSource) => characteristic.writeValue(value),
        readValue: () => characteristic.readValue(),
      }

      if (setter) {
        setBluetooth(outwardBluetooth as any)
        setCharacteristic(outwardCharacteristic as any)
      }

      setLoading(false)
      return {
        bluetooth: outwardBluetooth as BluetoothDevice,
        characteristic: outwardCharacteristic as BluetoothRemoteGATTCharacteristic,
      }
    }
    catch (error) {
      setLoading(false)
      throw error
    }
  }

  function clear() {
    setBluetooth(undefined)
    setCharacteristic(undefined)
  }

  return [
    {
      value: { bluetooth },
      loading,
    },
    request,
    clear,
  ] as const
}
