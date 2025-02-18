/* eslint-disable react-dom/no-dangerously-set-innerhtml */
/* eslint-disable ts/ban-ts-comment */
import { If, storeToState, useAsyncCallback, useWatch } from '@hairy/react-utils'
import { Button, Spin } from 'antd'
import { useRef, useState } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import { signer } from '@harsta/client'
import Typewriter from 'typewriter-effect'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { useOverlayInject } from '@overlastic/react'
import { HealthOracleDialog } from '../dialog'
import { postDoctorDiagnosis, postDoctorProof } from '@/api'
import { i18n } from '@/plugins'
import { store } from '@/store'
import { useProxyTutorials } from '@/hooks'

export interface HealthConsultContentProps {
  type: 'fortuneTeller' | 'sleeps' | 'rates' | 'steps' | 'oxygens'
  date: 'd' | 'w' | 'M'
  prompt?: number
}

const duid = {
  d: () => dayjs().format('YYYY-MM-DD'),
  w: () => `${dayjs().startOf('w').format('YYYY/MM/DD')}-${dayjs().endOf('w').format('YYYY/MM/DD')}`,
  M: () => dayjs().format('YYYY-MM'),
}

function uuid(date: 'd' | 'w' | 'M') {
  return duid[date]()
}

export function HealthConsultContent(props: HealthConsultContentProps) {
  const openHealthOracleDialog = useOverlayInject(HealthOracleDialog)
  const readHealthOracle = storeToState(store.config, 'readHealthOracle')[0]
  const [_, confirm] = useProxyTutorials()

  const localKey = [props.type, uuid(props.date), props.prompt].filter(Boolean).join(' - ')
  const localContent = useRef(localStorage.getItem(localKey))

  const { address } = useAccount()
  const [content, setContent] = useState<string>()
  const [loading, fetch] = useAsyncCallback(async () => {
    const store = localStorage.getItem(localKey)
    if (store)
      return store

    const { data: message } = await postDoctorProof({
      method: [props.type, props.date, props.prompt].filter(Boolean).join(' - '),
      from: address!,
      to: address!,
    })

    const signature = await signer.signMessage(message)
    const { data: content } = await postDoctorDiagnosis({
      method: props.type,
      lang: i18n.language,
      date: props.date,
      from: address!,
      prompt: props.prompt!,
      signature,
    })

    if (content)
      localStorage.setItem(localKey, content)

    if (props.type === 'fortuneTeller')
      confirm('prophet')
    else
      confirm('chats')

    setContent(content)
  })

  useMount(() => {
    if (!readHealthOracle)
      openHealthOracleDialog().then(fetch)
    else
      fetch()
  })

  useWatch([props.type, props.date], () => {
    localContent.current = ''
    setContent(undefined)
  })
  function parse(content?: string) {
    if (!content)
      return undefined
    try {
      // @ts-expect-error
      return marked.parse(content)
    }
    catch {
      return 'parse exception'
    }
  }

  return (
    <div className="text-[lime]">
      <If
        cond={!loading}
        else={(
          <Spin spinning>
            <div className="h-120px" />
          </Spin>
        )}
      >
        <div className="text-[lime]">
          {/* @ts-expect-error */}
          <If cond={!localContent.current} else={<div dangerouslySetInnerHTML={{ __html: parse(localContent.current) }} />}>
            <If
              cond={content}
              then={(
                <div className="text-[lime]">
                  <Typewriter
                    options={{
                      strings: parse(content),
                      autoStart: true,
                      delay: 10,
                    }}
                    onInit={(typewriter) => {
                      typewriter.callFunction(() =>
                        document.querySelector('.Typewriter__cursor')?.remove(),
                      )
                    }}
                  />
                </div>
              )}
              else={(
                <div className="flex-col-center gap-5">
                  <span>{t('Sign the transaction to uncover your health journey')}</span>
                  <Button onClick={fetch}>
                    {t('Sign Transaction')}
                  </Button>
                </div>
              )}
            />
          </If>
        </div>

      </If>
    </div>

  )
}
