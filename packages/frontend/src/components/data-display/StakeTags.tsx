/* eslint-disable react/no-array-index-key */
import { Tag } from 'antd'
import classNames from 'classnames'
import { parseEther } from 'ethers'
import { DetailedHTMLProps, If } from '@hairy/react-utils'
import IconRing from '@/assets/images/ring-icon.png'

export interface StakeTagsProps extends DetailedHTMLProps {
  onTagClick?: (amount: string) => void
  options: { ring: string, color: string, borderColor?: string }[]
  balance: bigint
  type?: 'tags' | 'ring'
}

export function StakeTags(props: StakeTagsProps) {
  const type = props.type || 'tags'

  function onInputTag(amount: string) {
    if (parseEther(amount) > props.balance)
      return
    props.onTagClick?.(amount)
  }

  return (
    <div className={classNames(['grid grid-cols-3 gap-12px', props.className])}>
      <If
        cond={type === 'tags'}
        then={(
          <>
            {props.options.map((t, i) => (
              <Tag
                key={i}
                onClick={() => onInputTag(t.ring)}
                className={classNames([
                  'h-28px cursor-pointer flex-center gap-1',
                  parseEther(t.ring) > props.balance && 'opacity-50',
                ])}
                color={t.color}
              >
                <span>
                  {t.ring}
                  Blueberry
                </span>
              </Tag>
            ))}
          </>
        )}
        else={(
          <>
            {props.options.map((t, i) => (
              <div
                key={i}
                onClick={() => onInputTag(t.ring)}
                className={classNames([
                  'flex-col-center',
                  parseEther(t.ring) > props.balance && 'opacity-50',
                ])}
              >
                <div
                  style={{ borderColor: t.borderColor, backgroundColor: t.color }}
                  className={classNames([
                  `border-solid border-1px  rounded-5px bg-op-50`,
                  'w-full max-w-70px h-70px flex-center mb-10px',
                  ])}
                >
                  <img className="w-50px" src={IconRing.src} />
                </div>
                <div className="text-10px">
                  {t.ring}
                  {' '}
                  $BLUEBERRY
                </div>

              </div>
            ))}
          </>
        )}
      />
    </div>
  )
}
