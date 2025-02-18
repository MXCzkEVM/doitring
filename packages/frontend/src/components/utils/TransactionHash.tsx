import { cover } from '@hairy/format'
import { Button } from 'antd'
import { defaultChain } from '@harsta/client'
import { copy } from '@/utils'

const explorer = defaultChain.blockExplorers.default.url

export function TransactionHash(props: { hash: string, link?: boolean }) {
  return (
    props.link
      ? (
          <Button type="text" size="small" onClick={() => window.open(`${explorer}/tx/${props.hash}`)}>
            <span>{cover(props.hash, [4, 3, 4])}</span>
            <div className="i-mdi-invoice-text-arrow-right" />
          </Button>
        )
      : (
          <div className="flex-center gap-1" onClick={() => copy(props.hash)}>
            <span>{cover(props.hash, [4, 3, 4])}</span>
            <div className="i-ph-copy-simple-duotone" />
          </div>
        )
  )
}
