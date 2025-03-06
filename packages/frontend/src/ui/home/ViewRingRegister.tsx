import { Button } from 'antd'
import ImageRing from '@/assets/images/ring.png'
import ImageRingPair from '@/assets/images/ring-pair.png'
import { ButtonWithRegisterRing } from '@/components'

export function ViewRingRegister(props: { onBack: () => void }) {
  return (
    <div className="mx-17px">
      <div className="absolute top-120px left-0 right-0">
        <img className="w-full" src={ImageRing.src} />
      </div>
      <div className="mt-70px mb-12px flex items-center gap-2" onClick={props.onBack}>
        <div className="text-24px i-material-symbols-arrow-back-rounded" />
        <span className=" text-20px">
          Register your Ring
        </span>
      </div>
      <div className="flex justify-center mb-100px relative z-1">
        <img className="w-full mt-24px" src={ImageRingPair.src} />
      </div>
      <ButtonWithRegisterRing>
        <Button
          className="w-full mb-17px"
          type="primary"
          size="large"
        >
          Start register
        </Button>
      </ButtonWithRegisterRing>

    </div>
  )
}
