/* eslint-disable ts/ban-ts-comment */
import { storeToState } from '@hairy/react-utils'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Methods } from './config'
import { store } from '@/store'

export function useWriteWithResponse() {
  const [characteristic] = storeToState(store.bluetooth, 'characteristic')
  const [emitter] = storeToState(store.bluetooth, 'emitter')
  const { t } = useTranslation()

  return function writeWithResponse(command: Uint8Array) {
    async function call() {
      if (!characteristic)
        return
      // @ts-expect-error
      const frag = Object.values(Methods).find(m => m.uid === command[0])?.frag
      return new Promise((resolve, reject) => {
        const resolveKey = `characteristicvaluechanged:${command[0]}`
        const rejectKey = `gattserverdisconnected`
        const data: number[] = []
        let timer: NodeJS.Timeout

        emitter.on(resolveKey, parse)

        function resolved() {
          clearTimeout(timer)
          resolve(data)
          emitter.off(resolveKey, parse)
          emitter.off(rejectKey, rejected)
        }

        function rejected() {
          reject(new Error('GATT Server is disconnected. Cannot perform GATT operations.'))
          toast.warn(t('Bluetooth connection disconnected'))
        }

        function parse(event: any) {
          clearTimeout(timer || 0)
          const dataView = new Uint8Array(event.target?.value.buffer)
          data.push(...Array.from<number>(dataView))
          if (frag) {
            timer = setTimeout(resolved, 5000)
            if (dataView.at(-1) === 255)
              resolved()
          }
          else {
            resolved()
          }
        }

        emitter.once(rejectKey, rejected)
        characteristic.writeValue(command)
      })
    }
    return call() as Promise<Uint8Array>
  }
}
