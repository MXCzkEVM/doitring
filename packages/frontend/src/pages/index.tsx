/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { useOverlayInject } from '@overlastic/react'
import { If, storeToState, useWhenever } from '@hairy/react-utils'
import { Button, Divider } from 'antd'
import { useAccount, useConnect } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { t } from 'i18next'
import { FingerMeasurementDialog } from '@/components/dialog/FingerMeasurement'
import Layout from '@/layout'
import ImageBlueberry from '@/assets/images/blueberry.png'
import ImageRing from '@/assets/images/ring.png'
import ImageRingPair from '@/assets/images/ring-pair.png'
import { useProxyMiner, useProxyMinerDetail, useProxyTutorials } from '@/hooks'
import { ButtonWithRegisterRing, TutorialDialog } from '@/components'
import { store } from '@/store'

function isMobile() {
  return typeof window !== 'undefined'
    && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || window.axs !== undefined
}

function Page() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [{ value: miner }] = useProxyMiner()
  const openFingerMeasurementDialog = useOverlayInject(FingerMeasurementDialog)
  useWhenever(router.query.measure, () => openFingerMeasurementDialog())
  const [tab, setTab] = useState('ViewRingStarted')

  return (
    <div style={{ fontFamily: 'Anaheim-Regular' }}>
      <If
        cond={!miner || !isConnected}
        else={<ViewRingTutorial />}
      >
        <If
          cond={tab === 'ViewRingStarted'}
          then={<ViewRingStarted onStart={() => setTab('ViewRingRegister')} />}
          else={<ViewRingRegister onBack={() => setTab('ViewRingStarted')} />}
        />
      </If>
    </div>
  )
}

function ViewRingStarted(props: { onStart?: () => void }) {
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

function ViewRingRegister(props: { onBack: () => void }) {
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

function ViewRingTutorial() {
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
          {makeMosts.map((option, index) => (
            <div
              onClick={() => !option.done && openTutorialDialog(option)}
              key={index}
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

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: true }}
      tabbarProps={{ miner: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
