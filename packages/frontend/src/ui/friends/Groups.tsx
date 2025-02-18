import { Button, Input, List, QRCode, Tag } from 'antd'
import { Card as MCard } from 'antd-mobile'
import { useAsync } from 'react-use'
import { useAccount } from 'wagmi'
import { If } from '@hairy/react-utils'
import { useOverlayInject } from '@overlastic/react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { MonthlyClaim } from './MonthlyClaim'
import { CreateOwn } from './CreateOwn'
import { useProxyMiner } from '@/hooks'
import { getGroupDetailId, getGroupDetailIdMembers } from '@/api'
import { Avatar, GroupMembersDialog } from '@/components'
import { Member } from '@/api/index.type'
import { copy } from '@/utils'
import { ReferralURL } from '@/config'

export function Groups() {
  const [{ value: miner }] = useProxyMiner()
  const openGroupMembers = useOverlayInject(GroupMembersDialog)
  const { t } = useTranslation()
  const { address } = useAccount()

  const { value: group } = useAsync(
    () => getGroupDetailId({ id: miner!.group! }),
    [miner],
  )

  const { value: members = [] } = useAsync(
    (): Promise<Member[]> => getGroupDetailIdMembers({ id: miner!.group! }, { page: 1 }).then(r => r.data),
    [miner],
  )

  return (
    <div>
      <MCard className="mx-17px px-17px mb-24px mt-24px">
        <div className="flex gap-12px relative">
          <Avatar className="w-48px h-48px flex-shrink-0 rounded-full overflow-hidden" src={group?.image} />
          <div className="flex-1 flex-col justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="text-16px font-bold">
                {group?.name}
              </div>
              <span className="text-[rgba(255,255,255,0.45)]">
                #
                {group?.id}
              </span>
            </div>

            <div className="flex gap-2 text-[rgba(255,255,255,0.45)]">
              {group?.description || 'Not yet introduced~'}
            </div>
          </div>
          <div className="flex-col-center gap-14px w-68px absolute right-12px -top-24px">
            <div className="w-68px h-68px bg-[rgba(48,48,48)] p12px rounded-2">
              <QRCode size={68} value={group?.invite || ''} bordered={false} />
            </div>
            <Button
              size="small"
              className="flex-center"
              onClick={() =>
                copy(`${ReferralURL}?url=${location.origin}?invite=${group?.invite}`)}
            >
              <div className="flex-center">
                <span className="text-12px mr-1">{group?.invite}</span>
                <div className="flex-shrink-0 i-material-symbols-attach-file-rounded" />
              </div>
            </Button>
          </div>
        </div>
      </MCard>

      <div className="mx-17px mb-18px h-22px flex gap-2">
        {group?.attributes?.filter(Boolean)?.map(val => (
          <Tag className="m-0" key={val}>
            {val}
          </Tag>
        ))}
      </div>

      <If cond={address === group?.creator} else={<CreateOwn />}>
        <div className="mr-14px">
          <MonthlyClaim group={group!} />
        </div>
      </If>

      <MCard
        className="mx-17px px-17px pt-6px mb-24px"
        title={(
          <div className="mx-2px flex justify-between" onClick={openGroupMembers}>
            <span>{t('Members')}</span>
            <span className="flex-center gap-1 font-normal text-[rgba(255,255,255,0.45)]">
              <span className="text-12px">{t('View all members')}</span>
              <div className="text-12px i-material-symbols-arrow-forward-ios-rounded" />
            </span>
          </div>
        )}
      >
        <List
          itemLayout="horizontal"
          dataSource={members}
          renderItem={(item, index) => (
            <UserInfo member={item} key={index} />
          )}
        />
      </MCard>

    </div>
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
