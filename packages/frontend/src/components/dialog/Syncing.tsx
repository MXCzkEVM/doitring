import { useExtendOverlay } from '@overlastic/react'
import { Modal, Progress } from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import NProgress from 'nprogress'
import { Autoplay, Navigation } from 'swiper/modules'
import { noop } from '@/utils'

export function SyncingDialog() {
  const { resolve, visible } = useExtendOverlay({ duration: 300 })
  const { t } = useTranslation()
  const [options, setOptions] = useState<any[]>([])

  useMount(() => setOptions(shuffleArray([
    {
      title: t('Sync Load QA Title - 1'),
      content: t('Sync Load QA Content - 1'),
      image: '/syncs/1.jpg',
    },
    {
      title: t('Sync Load QA Title - 2'),
      content: t('Sync Load QA Content - 2'),
      image: '/syncs/2.jpg',
    },
    {
      title: t('Sync Load QA Title - 3'),
      content: t('Sync Load QA Content - 3'),
      image: '/syncs/3.jpg',
    },
    {
      title: t('Sync Load QA Title - 4'),
      content: t('Sync Load QA Content - 4'),
      image: '/syncs/4.jpg',
    },
    {
      title: t('Sync Load QA Title - 5'),
      content: t('Sync Load QA Content - 5'),
      image: '/syncs/5.jpg',
    },
    {
      title: t('Sync Load QA Title - 6'),
      content: t('Sync Load QA Content - 6'),
      image: '/syncs/6.jpg',
    },
    {
      title: t('Sync Load QA Title - 7'),
      content: t('Sync Load QA Content - 7'),
      image: '/syncs/7.jpg',
    },
  ])))

  useMount(() => NProgress.start())
  useUnmount(() => NProgress.done())
  return (
    <Modal
      title="Syncing Ring"
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
      closable={false}
      maskClosable={false}
    >
      <Progress
        className="mb-12px"
        strokeColor={{ from: '#234F9B' }}
        status="active"
        size="small"
        percent={100}
        showInfo={false}
      />
      <Swiper className="w-full" autoplay={{ delay: 5000 }} navigation modules={[Autoplay, Navigation]}>
        {options.map(option => (
          <SwiperSlide key={option.image}>
            <div className="relative px1">
              <div className="mb-4px">{option.title}</div>
              <div className="relative rounded-lg overflow-hidden">
                <img className="w-full h-240px object-cover" src={option.image} />
                <div className="absolute-bl bottom-5px px3 py-2 z-0 bg-[rgba(0,0,0,.6)]">
                  {option.content}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Modal>
  )
}

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
