import { If, storeToState } from '@hairy/react-utils'
import { useRouter } from 'next/router'
import { useOverlayInject } from '@overlastic/react'

import { Button, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { useProxyMiner, useProxyMinerDetail, useProxyTutorials } from '@/hooks'
import { TutorialDialog } from '@/components'
import { store } from '@/store'

export function ViewRingTutorial() {
  const [tutorials] = useProxyTutorials()
  const openTutorialDialog = useOverlayInject(TutorialDialog)
  const router = useRouter()

  const [{ value: miner }] = useProxyMiner()
  const [{ value: detail }] = useProxyMinerDetail()
  const [histories] = storeToState(store.user, 'histories')
  const { t } = useTranslation()

  const makeMosts = [
    {
      title: t('Sync your data for 2 days'),
      description: t('Ring Tutorial 1'),
      image: '/Make the most/Sync Data Daily.png',
      done: detail.claims.length >= 2,
    },
    {

      title: t('Create a Health Group'),
      description: t('Ring Tutorial 2'),
      image: '/Make the most/Ring Together.png',
      done: !!miner?.group,
      footer: (
        <Button onClick={() => router.push('/friends')}>
          Join or Create a group
        </Button>
      ),
    },
    {
      title: t('Chat with Your AI Health Advisor'),
      description: t('Ring Tutorial 3'),
      image: '/Make the most/Chat with AI.png',
      done: tutorials.chats,
    },
    {
      title: t('Consult a prophet about your ring'),
      description: t('Ring Tutorial 4'),
      image: '/Make the most/Chat with the Prophet.png',
      done: tutorials.prophet,
    },
  ]
  const learnMores = [
    {
      title: t('Order Additional Rings for Loved Ones'),
      description: t('Ring Tutorial 5'),
      image: '/Learn more/Refer & Earn.png',
      done: !!histories.length,
    },
  ]

  return (
    <>
      <div className="mx-17px">
        <div className="my-10px text-20px">
          {t('Watch Tutorials')}
        </div>
        <img
          onClick={() => window.open('https://www.youtube.com/@BlueBerryRing')}
          src="/Watch Tutorials/BlueBerry Tutorial.png"
          className="w-190px"
        />
      </div>
      <div className="mx-17px mt-20px mb-10px text-20px">
        {t('Make the most')}
      </div>
      <div className="mx-17px pb-10px overflow-x-auto">
        <div className="relative flex gap-10px">
          {makeMosts.map(option => (
            <div
              onClick={() => !option.done && openTutorialDialog(option)}
              key={option.title}
              className="relative"
            >
              <div className="absolute overflow-hidden inset-0 flex-center text-center">
                <span className="text-20px mx-12px">{option.title}</span>
                <If cond={option.done}>
                  <TutorialFinished />
                </If>
              </div>
              <img className="w-140px" src={option.image} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-17px mt-20px mb-10px text-20px">
        {t('Learn more')}
      </div>
      <div className="mx-17px pb-10px overflow-x-auto">
        <div className="relative flex gap-10px">
          <div
            onClick={() => !learnMores[0].done && openTutorialDialog(learnMores[0])}
            className="relative"
          >
            <div className="absolute overflow-hidden inset-0 flex-center text-center">
              {/* <span className="text-20px mx-12px">{learnMores[0].title}</span> */}
              <If cond={learnMores[0].done}>
                <TutorialFinished />
              </If>
            </div>
            <img className="w-190px" src={learnMores[0].image} />
          </div>
          <img
            onClick={() => window.open('https://blueberryring.com/')}
            src="/Learn more/AI Doctor Explained.png"
            className="w-190px h-310px"
          />
        </div>
      </div>

      <Divider>
        <Button type="text" size="small" color="#234F9B" onClick={() => router.push('/order')}>
          {t('Order More Ring')}
        </Button>
      </Divider>
    </>
  )
}

function TutorialFinished() {
  return (
    <div className="bg-[#FF6F6F] h-26px w-100% absolute inset-0 m-auto flex-center -rotate-45">
      <span className="relative z-1">{t('Finished')}</span>
      <div className="absolute w-200% bg-[#FF6F6F] h-26px"></div>
    </div>
  )
}
