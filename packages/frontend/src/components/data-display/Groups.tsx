import { List, Spin } from 'antd'
import { useAsyncFn } from 'react-use'
import { If, useWatch } from '@hairy/react-utils'

import { getGroup } from '@/api'
import { GroupCard } from '@/ui/friends/GroupCard'
import { GetGroupQuery } from '@/api/index.type'

export interface GroupsProps extends GetGroupQuery {

}

export function Groups(props: GroupsProps) {
  const [{ value: groups = [], loading }, fetchGroups] = useAsyncFn(
    async () => {
      return getGroup({ ...props }).then(res => res.data)
    },
    [props],
  )

  useWatch([props], fetchGroups, { immediate: true })

  return (
    <Spin spinning={loading}>
      <div className="mt-24px flex-col gap-5 min-h-340px">
        <If
          cond={groups.length}
          then={groups.map(group => <GroupCard group={group} key={group.id} />)}
          else={<List dataSource={[]} />}
        />
      </div>
    </Spin>
  )
}
