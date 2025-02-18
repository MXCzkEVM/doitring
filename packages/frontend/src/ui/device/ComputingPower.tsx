import { List, Typography } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useProxyUser } from '@/hooks'

interface Content {
  type: 'percent' | 'point'
  content: string
  value: number
}

export function ComputingPower() {
  const [{ value: user }] = useProxyUser()
  const { t } = useTranslation()
  const data = [
    user?.bonusIsGroup && { type: 'percent', content: t('Group Season Level Bonus'), value: user.bonusIsGroup },
    user?.bonusInToken && { type: 'percent', content: t('Lock in Ring Token Bonus'), value: user.bonusInToken },
    user?.pointInBasic && { type: 'point', content: t('Daily Health Points'), value: user.pointInBasic },
  ]
  const contents = data.filter(Boolean) as Content[]
  return (
    <>
      <h2 className="mt-8">
        {t('Scores')}
      </h2>
      <List
        dataSource={contents}
        renderItem={item => (
          <List.Item>
            <div className="flex w-full items-center gap-2">
              <Typography.Text
                className={classNames([
                  item.type === 'point' ? 'bg-emerald-6' : 'bg-cyan-6',
                  'rounded px-1 h-24px bg-opacity-35',
                ])}
              >
                {item.type.toLocaleUpperCase()}
              </Typography.Text>
              <div className="flex flex-1 gap-2">
                <span className={item.type === 'percent' ? 'text-fuchsia-7' : 'text-gray-5'}>
                  {item.type === 'percent' ? `+ ${item.value}%` : `+${item.value} point`}
                </span>
                <span>{item.content}</span>
              </div>
              <div>{(user?.updateAt && dayjs(user.updateAt).format('MM/DD HH:mm')) || '--'}</div>
            </div>
          </List.Item>
        )}
      />
    </>
  )
}
