import { ReactNode } from 'react'
// import { Tabs } from 'antd'
import { Avatar } from 'antd'
import Layout from '@/layout'
import { NonNotExistAccount, NonNotExistChain, NonNotExistGroup, NonNotExistMiner, Tabs } from '@/components'
import { Steps } from '@/ui/friends/Steps'
import { Groups } from '@/ui/friends/Groups'
import { Season } from '@/ui/friends/Season'

function Page() {
  const items = [
    { value: '1', label: 'Group', children: <Groups /> },
    { value: '2', label: 'Season', children: <Season /> },
    // { value: '3', label: 'Steps', children: <Steps /> },
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
