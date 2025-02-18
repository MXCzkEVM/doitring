import { cover } from '@hairy/format'
import { If } from '@hairy/react-utils'
import { List, Tabs, Tag } from 'antd'
import { useAsync } from 'react-use'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import { getRankGlobal, getRankGroup } from '@/api'
import { Avatar, TopThree } from '@/components'
import { whenever } from '@/utils'
import { User } from '@/api/index.type'

export function Ranking() {
  const router = useRouter()
  const { address } = useAccount()

  const { value: gRanks = [] } = useAsync(
    async () => {
      const { data } = await getRankGlobal()
      return data
    },
  )
  const { value: pRanks = [] } = useAsync(
    async () => {
      const data = await whenever(address, owner =>
        getRankGroup({ owner }).then(res => res.data))
      return data
    },
    [address],
  )
  return (
    <div className="m-17px">
      <div className="text-18px text-center mb-24px font-bold">Top Performers</div>
      <TopThree
        items={gRanks}
        renderItem={item => (
          <>
            <span className="text-12px text-center truncate">
              {item?.nickname || cover(item?.owner || '', [4, 4, 4])}
            </span>
            <span className="text-[rgba(255,255,255,0.45)]">
              Invited
              {' '}
              {item?.invited}
            </span>
          </>
        )}
      />
      <Tabs
        type="line"
        size="small"
        className="ant-tabs-with-full"
        centered
        onChange={(key) => {
          whenever(key === 'referral', () => {
            router.push('/rewards/referral')
          })
        }}
        items={[
          { key: 'global', label: 'Global Ranking', children: <Ranks source={gRanks} /> },
          { key: 'friends', label: 'Friends', children: <Ranks source={pRanks} /> },
          { key: 'referral', label: 'Referral' },
        ]}
      />

    </div>
  )
}

export interface RanksProps {
  source: User[]
}

function Ranks(props: RanksProps) {
  return (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={props.source}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={(
              <div className="flex-center">
                <span className="font-bold mr-2">{index + 1}</span>
                <Avatar className="w-48px h-48px mb-8px" src={item?.avatar} />
              </div>
            )}
            title={item.nickname || cover(item.owner, [4, 4, 4])}
            description={`invited ${item.invited}`}
          />
          <div className="flex-col text-[rgba(255,255,255,0.45)]">
            <span>{dayjs(item.updateAt).format('YYYY/MM/DD')}</span>
            <span>{dayjs(item.updateAt).format('HH:mm PM')}</span>
          </div>
        </List.Item>
      )}
    />
  )
}
