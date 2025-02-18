import { Button, Input } from 'antd'
import { useOverlayInject } from '@overlastic/react'
import { useState } from 'react'
import { useDebounce } from '@hairy/react-utils'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { GroupAdvancedSearchDialog, GroupCondsDialog, GroupScannerDialog } from '../dialog'
import { Groups } from '../data-display'

export function NonNotExistGroupLoaded() {
  const [_keyword, setKeyword] = useState<string>('')
  const keyword = useDebounce(_keyword, 500)
  const [advanced, setAdvanced] = useState<any>()

  const { t } = useTranslation()
  const openGroupScannerDialog = useOverlayInject(GroupScannerDialog)
  const openGroupCondsDialog = useOverlayInject(GroupCondsDialog)
  const openGroupAdvancedDialog = useOverlayInject(GroupAdvancedSearchDialog)

  return (
    <div className="m-24px">
      <Input
        suffix={(
          <div className="flex gap-2 items-center">
            <div
              className="i-mdi-line-scan text-18px cursor-pointer"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                openGroupScannerDialog()
              }}
            />
            <div
              className={classNames([
                'i-material-symbols-format-list-bulleted-rounded text-20px cursor-pointer',
                advanced ? 'text-[#6c34cc]' : '',
              ])}
              onClick={() =>
                openGroupAdvancedDialog({ initialValues: advanced }).then(setAdvanced)}
            />
          </div>
        )}
        size="large"
        placeholder="Search And Join Group"
        value={_keyword}
        onInput={event => setKeyword(event.currentTarget.value)}
      />
      <Groups keyword={keyword} {...advanced} />

      <div className="h-48px" />

      <div className="w-full fixed max-w-xl mx-auto left-0 right-0 bottom-84px flex-center">
        <div className="mx-84px w-full">
          <Button
            className="w-full"
            type="primary"
            onClick={() => openGroupCondsDialog()}
          >
            <span>{t('Create New Group')}</span>
            <span>!</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
