import { useAsync } from 'react-use'
import { Divider } from 'antd'
import { If } from '@hairy/react-utils'
import { cover } from '@hairy/format'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { getSeasonMembers } from '@/api'
import { Member, MemberData, Season } from '@/api/index.type'
import { Avatar } from '@/components'
import { useProxyMiner } from '@/hooks'

export interface MemberLeaderboardProps {
  season: Season
}

export function MemberLeaderboard(props: MemberLeaderboardProps) {
  const { address } = useAccount()
  const { t } = useTranslation()
  const { value: members = [] } = useAsync(
    async () => getSeasonMembers({ season: props.season.id }).then(res => res.data),
    [props.season],
  )

  const membersNotWithOwner = members.filter(ms => ms.address.toLowerCase() !== address?.toLowerCase())
  const membersWithOwner = members.filter(ms => ms.address.toLowerCase() === address?.toLowerCase())
  function renderMemberItem(member: MemberData) {
    return (
      <div className="rounded-12px py-8px px-14px flex-y-center gap-12px bg-[#1C1C1C]" key={member.address}>
        <span className="w-16px">{member.rank}</span>
        <Avatar className="w40px h40px" src={member.avatar} />
        <span className="flex-1">{member.nickname || cover(member.address, [4, 4, 4])}</span>
        <span>
          {member.score}
          {' '}
          pts
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="mx-17px mb-12px">
        <Divider className="mb-12px">
          <div className="flex items-center gap-12px">
            <span className="font-bold ">{t('Member Leaderboard')}</span>
          </div>
        </Divider>
      </div>
      <div className="flex justify-between mb-24px mx-40px">
        <div className="flex-col justify-end items-center">
          <Avatar className="w-40px h-40px mb-8px" src={members[1]?.avatar} />
          <div className="flex-col-center max-w-120px h-30px">
            <If cond={members[1]} else="--">
              <span className="text-12px w-120px text-center truncate">
                {members[1]?.nickname || cover(members[1]?.address || '', [4, 4, 4])}
              </span>
              <span className="text-[rgba(255,255,255,0.45)]">
                {members[1]?.score}
                {' '}
                pts
              </span>
            </If>
          </div>
        </div>
        <div className="flex-col justify-end items-center">
          <Avatar className="w-60px h-60px mb-8px" src={members[0]?.avatar} />
          <span className="text-12px max-w-140px text-center truncate">
            {members[0]?.nickname || cover(members[0]?.address || '', [4, 4, 4])}
          </span>
          <span className="text-[rgba(255,255,255,0.45)]">
            {members[0]?.score}
            {' '}
            pts
          </span>
        </div>
        <div className="flex-col justify-end items-center">
          <Avatar className="w-40px h-40px mb-8px" src={members[2]?.avatar} />
          <div className="flex-col-center h-30px max-w-120px">
            <If cond={members[2]} else="--">
              <span className="text-12px max-w-120px text-center truncate">
                {members[2]?.nickname || cover(members[2]?.address || '', [4, 4, 4])}
              </span>
              <span className="text-[rgba(255,255,255,0.45)]">
                {members[2]?.score}
                {' '}
                pts
              </span>
            </If>
          </div>
        </div>
      </div>
      <div>
      </div>
      <div className="mx-17px">
        {membersWithOwner.map(renderMemberItem)}
      </div>

      <If cond={membersNotWithOwner.length}>
        <Divider />

        <div className="flex-col text-14px gap-10px mx-17px">
          {membersNotWithOwner.map(renderMemberItem)}
        </div>
        <div className="mx-17px">
          <Divider>
            {/* TODO */}
            <a className="font-normal text-14px flex-center gap-1">
              <span>Load More</span>
              <div className="text-16px i-material-symbols-arrow-cool-down" />
            </a>
          </Divider>
        </div>
      </If>

    </>
  )
}
