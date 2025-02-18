import { useExtendOverlay } from '@overlastic/react'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { ReactQrcodeScanner } from '../libraries/ReactQrcodeScanner'

export function AddressScannerDialog() {
  const { visible, reject, resolve } = useExtendOverlay({
    duration: 300,
  })
  return (
    <div
      className={classNames([
        'transition-opacity opacity-0 bg-[rgb(16,20,24,0.5)]',
        visible && '!opacity-100',
        'fixed inset-0 z-100',
        'flex-col-center',
      ])}
      onClick={() => reject()}
    >
      <div className="w-300px" onClick={event => event.stopPropagation()}>
        <ReactQrcodeScanner
          onSuccess={(decodedText) => {
            const [urlOrAddress, address] = decodedText.split('address=')
            resolve(address || urlOrAddress)
          }}
          onError={(message) => {
            toast.error(message)
            reject()
          }}
          fps={10}
          qrbox={{ width: 250, height: 250 }}
        />
      </div>
    </div>
  )
}
