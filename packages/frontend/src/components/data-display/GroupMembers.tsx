import { List, Spin } from 'antd'
import { useAsync } from 'react-use'
import { If } from '@hairy/react-utils'
import dayjs from 'dayjs'
import { Avatar } from '../data-display'
import { getGroupDetailIdMembers } from '@/api'
import { useProxyMiner } from '@/hooks'
import { Member } from '@/api/index.type'

export interface GroupMembersProps {
  limit?: number
}

export function GroupMembers(props: GroupMembersProps) {
  const [{ value: miner }] = useProxyMiner()
  const { value: members = [], loading } = useAsync(
    async (): Promise<Member[]> =>
      miner
        ? getGroupDetailIdMembers({ id: miner.group! }, { page: 1, limit: props.limit || 10000 }).then(r => r.data)
        : []
    ,
    [miner],
  )
  return (
    <Spin spinning={loading}>
      <List
        itemLayout="horizontal"
        dataSource={members}
        renderItem={(item, index) => (
          <UserInfo member={item} key={index} />
        )}
      />
    </Spin>
  )
}

function UserInfo(props: { member: Member }) {
  return (
    <List.Item className="py-10px!">
      <List.Item.Meta
        avatar={(
          <div className="flex-center h-44px">
            <Avatar src={props.member.avatar} />
          </div>
        )}
        title={(
          <div className="flex-col">
            <div>
              {props.member.nickname || props.member.owner.slice(0, 8)}
            </div>
            <div className="text-[rgba(255,255,255,0.45)] font-normal text-13px">
              {dayjs.duration(props.member.wearing, 'hour').format('HH [h]')}
            </div>
          </div>
        )}
      />
      <div className="flex-col text-13px text-[rgba(255,255,255,0.45)]">
        <If cond={props.member.updateAt} else="--">
          {dayjs(props.member.updateAt).format('MM/DD/YYYY HH:mm')}
        </If>
      </div>
    </List.Item>
  )
}
