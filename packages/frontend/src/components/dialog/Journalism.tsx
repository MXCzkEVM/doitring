/* eslint-disable ts/ban-ts-comment */
/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { useExtendOverlay } from '@overlastic/react'
import { Badge, List, Modal, Spin, Tabs, TabsProps } from 'antd'
import { useAsync } from 'react-use'
import { useState } from 'react'
import { If, storeToState, useAsyncCallback } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { noop } from '@/utils'
import { store } from '@/store'
import { New, helperGetNews } from '@/service'

export function JournalismDialog() {
  const { visible, resolve } = useExtendOverlay({
    duration: 300,
  })

  const { t } = useTranslation()

  const [tab, setTab] = useState('news')
  const [detail, setDetail] = useState<New>()
  const [reads, setReads] = storeToState(store.config, 'reads')

  const [loadingByDetail, onClickItem] = useAsyncCallback(async (item: New) => {
    setDetail(undefined)
    setTab('new')
    setDetail(item)
    setReads({ ...reads, [item.title]: true })
  })

  const { loading: loadingByNews, value: news = [] } = useAsync(async () => {
    return await helperGetNews()
  })

  const items: TabsProps['items'] = [
    {
      key: 'news',
      label: 'news',
      children: (
        <Spin spinning={loadingByNews}>
          <div className={!news.length ? 'min-h-120px' : ''}>
            <List
              itemLayout="horizontal"
              dataSource={news}
              renderItem={item => (
                <List.Item
                  onClick={() => onClickItem(item)}
                  title={item.title}
                  border
                >
                  <div className="w-full">
                    <div className="flex items-center">
                      <div className="w-16px">
                        <If cond={!reads[item.title]}>
                          <Badge dot />
                        </If>
                      </div>
                      <span className=" font-bold text-16px truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="ml-16px w-80% text-12px truncate text-[rgba(255,255,255,0.45)]">
                      {item.excerpt}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Spin>
      ),
    },
    {
      key: 'new',
      label: 'new',
      children: (
        <Spin spinning={loadingByDetail}>
          <div className="min-h-120px mt-12px">
            <If cond={detail}>
              <div className="flex items-center cursor-pointer mb-4" onClick={() => setTab('news')}>
                <div className="i-line-md-chevron-left text-16px pt-1" />
                <div className="text-16px font-bold">
                  {detail?.title}
                </div>
              </div>
              <div className="content">
                <div dangerouslySetInnerHTML={{ __html: parse(detail?.content) }} />
              </div>
            </If>
          </div>
        </Spin>
      ),
    },
  ]

  return (
    <Modal title={t('What is the news')} open={visible} onCancel={resolve} footer={noop}>
      <Tabs
        className="tabs-not-headers"
        defaultActiveKey="1"
        activeKey={tab}
        onChange={setTab}
        items={items}
      />
    </Modal>
  )
}

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
