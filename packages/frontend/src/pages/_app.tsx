/* eslint-disable no-new */
import Head from 'next/head'

import { ReactNode } from 'react'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { Button, ConfigProvider, theme } from 'antd'
import { ToastContainer } from 'react-toastify'
import { I18nextProvider } from 'react-i18next'
import { OverlaysProvider } from '@overlastic/react'
import { useMount } from 'react-use'
import { BootstrapProvider, MountsProvider, WagmiConfigProvider } from '@/components'
import { config } from '@/config'
import { useMounted } from '@/hooks'
import Layout from '@/layout'
import '@rainbow-me/rainbowkit/styles.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '@moonchain/metadata/style.css'

import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/index.scss'
import { i18n } from '@/plugins'

export default function App({ Component, pageProps }: any) {
  const layout = Component.layout || defaultLayout
  const mounted = useMounted()

  useMount(() => {
    console.log(process.env.NEXT_PUBLIC_NFT_URL)
    if (location.search.includes('debug'))
      new window.VConsole({ theme: 'dark' })
  })

  return (
    <>
      <Head>
        <title>BlueberryRing</title>
        <meta name="description" content="Blueberry Ring merges wellness with technology, creating a global community united in health empowerment. Earn $Blueberry Tokens as you enhance your well-being." />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,minimum-scale=1.0" />
        <link rel="icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <MountsProvider
        install={[
          { component: WagmiConfigProvider, props: { config } },
          { component: RainbowKitProvider, props: { theme: darkTheme({ accentColor: '#234F9B' }) } },
          { component: ConfigProvider, props: { theme: { algorithm: theme.darkAlgorithm, token: { colorPrimary: '#234F9B' } } } },
          { component: I18nextProvider, props: { i18n } },
          { component: OverlaysProvider },
          { component: BootstrapProvider },
        ]}
      >
        {mounted && layout(<Component {...pageProps} />)}
        <ToastContainer className="dark" />
      </MountsProvider>
    </>
  )
}

function defaultLayout(page: ReactNode) {
  return <Layout>{page}</Layout>
}
