import { useOverlayInject } from '@overlastic/react'
import { Button, Divider } from 'antd'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo } from 'react'
import { useAccount } from 'wagmi'
import classNames from 'classnames'
import { DetailedHTMLProps } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { useGroupConds } from './ContentForGroupCreate.hooks'
import { useProxyMiner } from '@/hooks'
import { GroupCreateDialog, UserSupplementaryDialog } from '@/components'

export interface ContentForGroupCreateProps extends DetailedHTMLProps {
  onConfirm?: () => void
}

export function ContentForGroupCreate(props: ContentForGroupCreateProps) {
  const openUserSupplementaryDialog = useOverlayInject(UserSupplementaryDialog)
  const { t } = useTranslation()
  const { address } = useAccount()
  const [{ value: miner }] = useProxyMiner()
  const openGroupCreateDialog = useOverlayInject(GroupCreateDialog)

  const { values: conditions } = useGroupConds(address!)

  function create() {
    if (!miner?.avatar || !miner.name) {
      openUserSupplementaryDialog().then(openGroupCreateDialog)
    }
    else {
      openGroupCreateDialog()
      props.onConfirm?.()
    }
  }

  const disabled = useMemo(() => ![
    conditions.balance && conditions.health,
    conditions.wearing && conditions.steps,
    conditions.whitelist,
    conditions.invited,
  ].some(cond => cond), [conditions])

  return (
    <div {...props}>
      <div className="text-center text-24px font-bold font-[Merriweather]">
        {t('Create New Group')}
      </div>
      <div className="mt-16px text-center font-[Merriweather]">
        {t('Create New Group condition title')}
      </div>
      <div className="mt-24px flex-center">
        <div className="inline-flex flex-col gap-8px">
          <ConditionRow cond={conditions?.wearing}>
            {t('Create New Group condition text 1')}
          </ConditionRow>
          <ConditionRow cond={conditions?.steps}>
            {t('Create New Group condition text 2')}
          </ConditionRow>

          <Divider className="my-2" />

          <ConditionRow cond={conditions?.balance}>
            {t('Create New Group condition text 3')}
          </ConditionRow>
          <ConditionRow cond={conditions?.health}>
            {t('Create New Group condition text 4')}
          </ConditionRow>

          <Divider className="my-2" />

          <ConditionRow cond={conditions?.whitelist}>
            {t('Create New Group condition text 5')}
          </ConditionRow>
          <Divider className="my-2" />
          <ConditionRow cond={conditions?.invited}>
            {t('Create New Group condition text 6')}
          </ConditionRow>
        </div>
      </div>
      <div className="m-6 flex-center text-center">
        <div className="font-[Merriweather] max-w-350px">
          {t('Create New Group condition text 7')}

        </div>
      </div>
      <div className="flex-center mt-24px">
        <Button
          onClick={create}
          type="primary"
          className="w-200px"
          disabled={disabled}
        >
          {t('Create Now')}
        </Button>
      </div>
    </div>
  )
}

function ConditionRow(props: PropsWithChildren<{ cond?: boolean }>) {
  return (
    <div className="flex items-center gap-2">
      <div className={classNames([!props.cond ? 'i-line-md-cancel bg-blueGray' : 'i-line-md-confirm-circle bg-emerald'])} />
      <span style={{ fontFamily: 'Noto Sans' }}>
        {props.children}
      </span>
    </div>
  )
}
