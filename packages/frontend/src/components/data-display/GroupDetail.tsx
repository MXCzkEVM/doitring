import { Button, Spin, Tag } from 'antd'
import { useAsync } from 'react-use'
import { If, useAsyncCallback } from '@hairy/react-utils'
import { useRouter } from 'next/router'
import { contracts } from '@harsta/client'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { useOverlayInject } from '@overlastic/react'
import { UserSupplementaryDialog } from '../dialog'
import { GroupMembers } from './GroupMembers'
import { getGroupDetailId, getGroupInviteIn, getSignGroupJoin } from '@/api'
import { copy, waitForProxyTransaction } from '@/utils'
import { useGroupLimit, useProxyMiner } from '@/hooks'
import { GetSignGroupJoinQuery } from '@/api/index.type'
import { ReferralURL } from '@/config'

interface GroupDetailProps {
  group?: number
  invite?: string
  onCancel?: () => void
  onJoined?: () => void
}

export function GroupDetail(props: GroupDetailProps) {
  const openUserSupplementaryDialog = useOverlayInject(UserSupplementaryDialog)

  const router = useRouter()
  const { t } = useTranslation()
  const { address } = useAccount()
  const [{ value: miner }, reloadMiner] = useProxyMiner()

  const { value: detail, loading: loadingByDetail } = useAsync(
    () => props.group
      ? getGroupDetailId({ id: props.group })
      : getGroupInviteIn({ in: props.invite! }),
    [props.group],
  )
  const [loadingByJoin, join] = useAsyncCallback(async () => {
    if (!miner?.avatar || !miner.name) {
      openUserSupplementaryDialog()
      return
    }
    const DoitRingFriend = contracts.DoitRingFriend.resolve()
    const params: GetSignGroupJoinQuery = {
      sender: address!,
    }
    if (props.invite)
      params.invite = props.invite
    if (props.group)
      params.group = props.group
    const { data: signature } = await getSignGroupJoin(params)
    const transaction = DoitRingFriend.join.populateTransaction(
      address!,
      detail!.id,
      signature,
    )
    await waitForProxyTransaction(transaction, 'join')
    await reloadMiner()
    await router.replace('/friends')
    props.onJoined?.()
  })

  const limit = useGroupLimit(props.group || detail?.id)

  return (
    <Spin spinning={loadingByDetail}>
      <div className="flex gap-4 mt-24px mb-24px">
        <div className="w-84px h-84px flex-shrink-0 overflow-hidden rounded-full bg-dark">
          <img className="w-full h-full object-cover" src={detail?.image} />
        </div>
        <div className="flex-col">
          <div className="text-18px font-bold">
            <span>{detail?.name}</span>
            <span> #</span>
            <span>{detail?.id}</span>
          </div>
          <div className="mb-8px">
            {detail?.description}
          </div>
          <If cond={detail?.attributes.length}>
            <div className="flex gap-2">
              {detail?.attributes?.map(val => (
                <Tag className="m-0" key={val}>
                  {val}
                </Tag>
              ))}
            </div>
          </If>
        </div>
      </div>
      <div className="flex gap-4 justify-between flex-wrap mb-24px">
        <div className="flex-col">
          <div className="font-bold">Hexagon</div>
          <div className="text-12px">{detail?.hexagon}</div>
        </div>
        <div className="flex-col">
          <div className="font-bold">Type</div>
          <div className="text-12px">{detail?.opening ? 'Open' : 'Only invite'}</div>
        </div>
        <div className="flex-col">
          <div className="font-bold">Group Code</div>
          <div
            className="flex-center"
            onClick={() =>
              copy(`${ReferralURL}?url=${location.origin}?invite=${detail?.invite}`)}
          >
            <span className="text-12px">{detail?.invite}</span>
            <div className="text-12px i-material-symbols-attach-file-rounded" />
          </div>
        </div>
        <div className="flex-col">
          <div className="font-bold">Group Power</div>
          <div className="text-12px">{detail?.score || '-'}</div>
        </div>

      </div>

      <div className="flex justify-between items-center gap2">
        <div className="font-bold">Members</div>
        <div className="flex-center">
          <div className="i-line-md-person-filled text-base" />
          <span>
            {detail?.members}
            {' '}
            /
            {' '}
            limit
            {' '}
            {limit}
          </span>
        </div>
      </div>

      <GroupMembers limit={2} />

      <If cond={!miner?.group}>
        <div className="flex justify-end gap-2 mt-12px">
          <Button onClick={props.onCancel}>
            {t('Cancel')}
          </Button>
          <Button
            type="primary"
            loading={loadingByJoin}
            onClick={join}
            disabled={(detail?.members || 0) >= limit}
          >
            {t('Join')}
          </Button>
        </div>
      </If>

    </Spin>
  )
}
