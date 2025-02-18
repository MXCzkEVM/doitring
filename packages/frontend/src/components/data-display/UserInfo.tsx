import { useOverlayInject } from '@overlastic/react'
import { UserInfoDialog, UserSupplementaryDialog } from '../dialog'
import { Avatar } from './Avatar'
import { Nickname } from './Nickname'
import { useProxyMiner } from '@/hooks'

export function UserInfo() {
  const [{ value: miner }] = useProxyMiner()
  const openUserInfoDialog = useOverlayInject(UserInfoDialog)
  return (
    <div className="flex-center gap-2" onClick={openUserInfoDialog}>
      <Avatar src={miner?.avatar} />
      <Nickname className="font-bold" />
    </div>
  )
}
