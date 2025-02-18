/* eslint-disable react/no-array-index-key */
import { Button, Card, Tag } from 'antd'
import { useRouter } from 'next/router'
import { useOverlayInject } from '@overlastic/react'
import { useTranslation } from 'react-i18next'
import { Group } from '@/api/index.type'
import { GroupDetailDialog } from '@/components'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const openGroupDetailDialog = useOverlayInject(GroupDetailDialog)
  const { t } = useTranslation()
  return (
    <Card size="small">
      <div className="flex items-center">
        <div className="h-70px w-70px rounded mr-4 overflow-hidden">
          <img className="w-full h-full object-cover" src={group.image} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-12px">
            <div className="text-18px">
              <span className="font-bold">{group.name}</span>
            </div>
            <div className="flex items-center">
              <div className="i-line-md-person-filled" />
              <span>{group.members}</span>
              <span className="mx-2"> / </span>
              <span>
                {group.score}
                {' '}
                MP
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {group.attributes.map((attr, index) => <Tag key={index}>{attr}</Tag>)}
            </div>
            <Button type="primary" onClick={() => openGroupDetailDialog({ group: +group.id })}>
              {t('View')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
