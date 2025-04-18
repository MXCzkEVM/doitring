import { ReactNode } from 'react'
import Layout from '@/layout'
import { NonNotExistAccount, NonNotExistChain, NonNotExistGroup, NonNotExistMiner, Tabs } from '@/components'
import { Groups } from '@/ui/friends/Groups'
import { Season } from '@/ui/friends/Season'

function Page() {
  const items = [
    { value: '1', label: 'Group', children: <Groups /> },
    { value: '2', label: 'Season', children: <Season /> },
  ]

  return (
    <NonNotExistAccount>
      <NonNotExistChain>
        <NonNotExistMiner>
          <NonNotExistGroup>
            <Tabs className="mx-17px" options={items} />
          </NonNotExistGroup>
        </NonNotExistMiner>
      </NonNotExistChain>
    </NonNotExistAccount>
  )
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{
        userInfo: true,
      }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
