import { useOverlayInject } from '@overlastic/react'
import { useTranslation } from 'react-i18next'
import { GroupCondsDialog } from '@/components'

export function CreateOwn() {
  const openGroupCondsDialog = useOverlayInject(GroupCondsDialog)
  const { t } = useTranslation()
  return (
    <div className="mx-17px mb-24px flex items-center justify-between gap-2 text-[rgba(255,255,255,0.45)]" onClick={openGroupCondsDialog}>
      <span>
        {t('Ring power Text')}
      </span>
      <div className="i-material-symbols-add-rounded" />
    </div>
  )
}
