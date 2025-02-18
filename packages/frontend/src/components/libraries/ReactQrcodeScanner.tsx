import { CameraDevice, Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode'
import { useRef } from 'react'
import { useMount } from 'react-use'
import { nanoid } from 'nanoid'
import { useWatch } from '@hairy/react-utils'
import { noop } from '@/utils'

export interface ReactScanQrcodeProps extends Html5QrcodeCameraScanConfig {
  verbose?: boolean
  onSuccess?: QrcodeSuccessCallback
  onError?: QrcodeErrorCallback
  camera?: string
  mode?: 'user' | 'environment'
}

export function ReactQrcodeScanner(props: ReactScanQrcodeProps) {
  const id = useRef(nanoid())
  const instance = useRef<Html5Qrcode>()
  const rendered = useRef(false)

  function initial() {
    const html5Qrcode = new Html5Qrcode(id.current, { verbose: props.verbose })
    instance.current = html5Qrcode
  }

  async function render() {
    if (!instance.current || rendered.current)
      return
    const cameraIdOrConfig = props.camera || { facingMode: props.mode || 'environment' }
    rendered.current = true

    await instance.current.start(
      cameraIdOrConfig,
      props,
      async (...args) => {
        await instance.current?.stop()
        instance.current?.clear()
        props.onSuccess?.(...args)
      },
      noop,
    )
  }
  async function stop() {
    if (!rendered.current)
      return
    rendered.current = false
    try {
      await instance.current?.stop()
      instance.current?.pause()
    }
    catch {}
  }

  useMount(() => initial())

  useWatch([props.mode, props.camera, instance.current], async () => {
    await stop()
    await render()
  })

  return (
    <div
      style={{
        width: '100%',
        minWidth: '300px',
        height: '300px',
        display: 'flex',
      }}
      id={id.current}
    >
    </div>
  )
}
