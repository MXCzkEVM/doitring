import { Button, Result, Select, Spin, Typography } from 'antd'
import { useExtendOverlay } from '@overlastic/react'
import classNames from 'classnames'
import { useMount } from 'react-use'
import { useState } from 'react'
import { If, useWhenever } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { useProxyBluetooth } from '@/hooks'
import { deviceOptionsByPrefix } from '@/config'

const { Paragraph, Text } = Typography
export interface DeviceScannerDialogProps {
  camera?: string
  tokenIds: { id: number, contract: string, name: string }[]
  promise: Promise<any>
}
export interface DeviceScannerDialogResult {
  tokenId: number
  sncode: string
}

export function DeviceScannerDialog(props: DeviceScannerDialogProps) {
  const { visible, reject, resolve } = useExtendOverlay({
    duration: 300,
  })
  const [current, setCurrent] = useState<string>()
  const [initial, setInitial] = useState(false)
  const { t } = useTranslation()
  const [bluetooth, setBluetooth] = useState<BluetoothDevice>()
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic >()
  const [{ loading }, fetchBluetooth] = useProxyBluetooth()

  function onResolved(decodedText: string) {
    const [token, tokenId] = current?.split(':') || []
    resolve({
      sncode: decodedText,
      tokenId,
      token,
      characteristic,
      bluetooth,
    })
  }

  // 00001800-0000-1000-8000-00805f9b34fb
  // 00001801-0000-1000-8000-00805f9b34fb
  // 0000190e-0000-1000-8000-00805f9b34fb
  // 0000fff0-0000-1000-8000-00805f9b34fb

  async function searchBluetooth() {
    const { bluetooth, characteristic } = await fetchBluetooth(deviceOptionsByPrefix, false)
    setCharacteristic(characteristic)
    setBluetooth(bluetooth)
  }

  useMount(() => setCurrent(`${props.tokenIds[0].contract}:${props.tokenIds[0].id}`))

  useWhenever(current && bluetooth, () => {
    if (bluetooth)
      Reflect.set(bluetooth, 'tokenId', current)
  })

  useMount(() => {
    props.promise
      .then(({ bluetooth, characteristic }) => {
        setCharacteristic(characteristic)
        setBluetooth(bluetooth)
      })
      .finally(() => setInitial(true))
  })

  function renderNotFindResult() {
    return (
      <Result
        status="error"
        title="Device search failed"
        subTitle="Please check following information."
        icon={(
          <div className="flex-center">
            <div className="text-red text-72px i-material-symbols-devices-off-outline" />
          </div>
        )}
      >
        <div className="desc">
          <Paragraph>
            <Text strong style={{ fontSize: 16 }}>
              {t('The connection bluetooth the following error')}
            </Text>
          </Paragraph>
          <Paragraph>
            <span>{t('browser may not support Bluetooth connection')}</span>
          </Paragraph>
          <Paragraph>
            <span>{t('Bluetooth device not authorized properly')}</span>
            <a
              className="ml-8px"
              onClick={searchBluetooth}
            >
              {t('re-find')}
              {' '}
              &gt;
            </a>
          </Paragraph>
        </div>
      </Result>
    )
  }

  return (
    <div
      className={classNames([
        'transition-opacity opacity-0 bg-[rgb(16,20,24,1)]',
        visible && '!opacity-100',
        'fixed inset-0 z-100',
        'max-w-xl mx-auto',
        'flex-col-center',
      ])}
      onClick={() => reject()}
    >
      <div className="cursor-pointer text-28px absolute right-20px top-12px i-material-symbols-close-rounded" />

      <If
        cond={initial || !loading}
        else={(
          <Spin spinning>
            <div className="h-280px" />
          </Spin>
        )}
      >
        <If cond={!bluetooth}>
          <div onClick={event => event.stopPropagation()}>
            {renderNotFindResult()}
          </div>
        </If>
      </If>

      <div className="w-300px flex-col-center gap-12px" onClick={event => event.stopPropagation()}>
        <If cond={bluetooth}>
          <div className="flex-col-center bg-dark-2 rounded-lg p-24px mb-12px">
            <img className="w-64px h-64px" src="/logo.svg" />
            <h4 className="mt-8px mb-0">
              Blueberry Ring
            </h4>
          </div>
        </If>

        {/* <Select
          onChange={setCurrent}
          value={current}
          placeholder="Camera"
          options={props.tokenIds.map(o => ({ label: o.name, value: `${o.contract}:${o.id}` }))}
          className="w-full bg-black"
        /> */}

        <Button
          type="primary"
          onClick={() => onResolved(bluetooth?.name || bluetooth?.id || '')}
          disabled={!bluetooth}
          className="w-full mt-12px"
        >
          {t('Confirm')}
        </Button>
      </div>

    </div>
  )
}

DeviceScannerDialog.resultType = undefined as unknown as DeviceScannerDialogResult
