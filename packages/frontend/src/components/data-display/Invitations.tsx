import { List, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { storeToState } from '@hairy/react-utils'
import { formatEtherByFormat } from '@/utils'
import { store } from '@/store'

export function Invitations() {
  const { t } = useTranslation()
  const [histories] = storeToState(store.user, 'histories')
  return (
    <List
      dataSource={histories}
      renderItem={item => (
        <List.Item>
          <div className="flex justify-between flex-1">
            <div className="flex-1 flex">
              <Typography.Text mark className="mr-2 text-12px ">[INVITE]</Typography.Text>
              <span className="text-14px mr-1">{item.memo}</span>
              <span className="text-14px flex-1 truncate">{t('purchase through code')}</span>
            </div>
            <div className="text-[rgba(255,255,255,0.45)]">
              +
              {formatEtherByFormat(item.amount)}
              {' '}
              USDT
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}
