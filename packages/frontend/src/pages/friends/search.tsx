import { ReactNode, useState } from 'react'
import { Input } from 'antd'
import { useDebounce } from '@hairy/react-utils'
import { useOverlayInject } from '@overlastic/react'
import classNames from 'classnames'
import { GroupAdvancedSearchDialog, GroupScannerDialog, Groups, NonNotExistAccount, NonNotExistMiner } from '@/components'
import Layout from '@/layout'

function Page() {
  const [_keyword, setKeyword] = useState<string>('')

  const keyword = useDebounce(_keyword, 500)

  const [advanced, setAdvanced] = useState<any>()
  const openGroupScannerDialog = useOverlayInject(GroupScannerDialog)
  const openGroupAdvancedDialog = useOverlayInject(GroupAdvancedSearchDialog)

  return (
    <NonNotExistAccount>
      <NonNotExistMiner>
        <div className="m-24px">
          <Input
            suffix={(
              <div className="flex gap-2 items-center">
                <div className="i-mdi-line-scan text-18px cursor-pointer" onClick={openGroupScannerDialog} />
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
        </div>
      </NonNotExistMiner>
    </NonNotExistAccount>
  )
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: false, back: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
