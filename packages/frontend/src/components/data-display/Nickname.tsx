import { cover } from '@hairy/format'
import { DetailedHTMLProps } from '@hairy/react-utils'
import { useAccount } from 'wagmi'
import { useProxyMiner } from '@/hooks'

interface NicknameProps extends DetailedHTMLProps {
}

export function Nickname(props: NicknameProps) {
  const [{ value: miner }] = useProxyMiner()
  const { address } = useAccount()
  return <div {...props}>{miner?.nickname || cover(address || '-', [4, 3, 4], '.')}</div>
}
