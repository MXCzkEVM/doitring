import { useExtendOverlay } from '@overlastic/react'
import { Button, Checkbox, Modal } from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useTranslation } from 'react-i18next'
import { Autoplay, Navigation } from 'swiper/modules'
import { storeToState } from '@hairy/react-utils'
import { noop } from '@/utils'
import { store } from '@/store'

export function HealthOracleDialog() {
  const { resolve, visible } = useExtendOverlay({ duration: 300 })
  const { t } = useTranslation()
  const [readHealthOracle, setReadHealthOracle] = storeToState(store.config, 'readHealthOracle')

  const options = [
    {
      title: t('Health Oracle Title - 1'),
      image: '/The Prophet/1.png',
    },
    {
      title: t('Health Oracle Title - 2'),
      image: '/The Prophet/2.png',
    },
    {
      title: t('Health Oracle Title - 3'),
      image: '/The Prophet/3.png',
    },
    {
      title: t('Health Oracle Title - 4'),
      image: '/The Prophet/4.jpg',
    },
    {
      title: t('Health Oracle Title - 5'),
      image: '/The Prophet/5.jpg',
    },
  ]

  return (
    <Modal
      title={(
        <div className="flex flex-wrap gap-2">
          <span>{t('Personal Health Oracle')}</span>
          <div className="flex-1 flex justify-end">
            <Checkbox
              className="flex-shrink-0"
              onChange={event => setReadHealthOracle(event.target.checked)}
              value={readHealthOracle}
            >
              <span>{t('Dont show again')}</span>
            </Checkbox>
          </div>

        </div>
      )}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
      closable={false}
      maskClosable={false}
    >

      <div className="mb-12px">{t('Unlock personalized health insights with our smart ring')}</div>
      <Swiper className="w-full mb-12px" autoplay={{ delay: 5000 }} navigation modules={[Autoplay, Navigation]}>
        {options.map(option => (
          <SwiperSlide key={option.image}>
            <div className="relative px1">
              <div className="relative rounded-lg overflow-hidden">
                <img className="w-full h-240px object-cover" src={option.image} />
                <div className="absolute-bl bottom-5px w-full px3 py1 z-0 bg-[rgba(0,0,0,.6)]">
                  {option.title}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-end my-8px">
        <Button onClick={() => resolve()} type="primary">
          {t('I understand and have synced my health data')}
        </Button>
      </div>
    </Modal>
  )
}
