import { useRouter } from 'next/router'
import { useOverlayInject } from '@overlastic/react'
import { Button } from 'antd'
import { useAccount, useConnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FingerMeasurementDialog } from '@/components/dialog/FingerMeasurement'
import ImageBlueberry from '@/assets/images/blueberry.png'
import ImageRing from '@/assets/images/ring.png'
import { useProxyMiner, useProxyMinerDetail } from '@/hooks'
import { isMobile } from '@/utils'

export function ViewRingStarted(props: { onStart?: () => void }) {
  const openFingerMeasurementDialog = useOverlayInject(FingerMeasurementDialog)
  const { openConnectModal } = useConnectModal()
  const { isConnected, isConnecting } = useAccount()
  const router = useRouter()
  const { isPending } = useConnect()
  const [{ loading: loadingByMiner }] = useProxyMiner()
  const [{ loading: loadingByDetail }] = useProxyMinerDetail()

  return (
    <div className="mx-17px h-full">
      <div className="flex items-center mx-12px mb-80px mt-24px">
        <img className="w-72px" src={ImageBlueberry.src} />
        <span className=" text-28px tracking-8px">BlueBerry AI</span>
      </div>

      <div className="absolute top-120px left-0 right-0">
        <img className="w-full" src={ImageRing.src} />
      </div>

      <div className="relative z-1">
        <div className="flex-col mx-12px tracking-6px text-19px line-height-30px  mb-150px">
          <span>The Ultimate</span>
          <span>Fusion of</span>
          <span>wellness and</span>
          <span>technology at</span>
          <span>your fingertips.</span>
        </div>
        <Button
          onClick={!isConnected ? openConnectModal : props.onStart}
          loading={isConnecting || isPending || loadingByMiner || loadingByDetail}
          size="large"
          type="primary"
          className="w-full mb-17px"
        >
          Start
        </Button>
        <Button size="large" className="w-full mb-17px" onClick={() => router.push('/order')}>
          No ring yet?
        </Button>
        {
          isMobile() && (
            <div className="flex-center  mb-17px">
              <span onClick={() => openFingerMeasurementDialog()}>
                Don't know your own size? Measure size
              </span>
            </div>
          )
        }

      </div>

    </div>
  )
}
