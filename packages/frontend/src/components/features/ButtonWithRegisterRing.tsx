import { useOverlayInject } from '@overlastic/react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { PropsWithChildren, useMemo } from 'react'
import { contracts } from '@harsta/client'
import { useAccount } from 'wagmi'
import { DeviceScannerDialog } from '../dialog'
import { MintButton } from './MintButton'
import { useProxyBluetooth, useProxyMiner, useProxyNFTs } from '@/hooks'
import { deviceOptionsByPrefix } from '@/config'
import { waitForProxyTransaction } from '@/utils'

export function ButtonWithRegisterRing(props: PropsWithChildren) {
  const openDeviceScannerDialog = useOverlayInject<any, any>(DeviceScannerDialog)

  const { t } = useTranslation()
  const { address } = useAccount()

  const fetchBluetooth = useProxyBluetooth()[1]
  const fetchMiner = useProxyMiner()[1]
  const [{ value }, fetchNFTs] = useProxyNFTs()
  const defaultNfts = useMemo(
    () => value.filter(v => !v.exist),
    [value],
  )
  async function onRegister(nfts = defaultNfts) {
    if (!nfts.length) {
      toast.dismiss()
      toast.warn(
        <div className="flex gap-12px">
          <span>{t('No Launchpad NFTs available')}</span>
          <MintButton onConfirm={() => fetchNFTs().then(onRegister)} />
        </div>,
        { autoClose: false },
      )
      return
    }

    const DoitRingDevice = contracts.DoitRingDevice.resolve()
    const data = await openDeviceScannerDialog({
      promise: fetchBluetooth(deviceOptionsByPrefix, false),
      tokenIds: nfts,
    })

    const transaction = DoitRingDevice.register.populateTransaction(
      address!,
      data.token,
      data.tokenId,
      data.sncode,
    )

    await waitForProxyTransaction(transaction, 'register')
    await fetchMiner()
    await fetchNFTs()
  }

  return (
    <div onClick={() => onRegister()}>
      {props.children || <div className="i-material-symbols-add-circle-outline-rounded cursor-pointer text-24px ml-12px" />}
    </div>

  )
}
