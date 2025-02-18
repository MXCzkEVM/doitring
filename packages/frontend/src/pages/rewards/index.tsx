import { ReactNode } from 'react'
import Layout from '@/layout'
import { NonNotExistAccount, NonNotExistMiner } from '@/components'
import { Ranking } from '@/ui/rewards/Ranking'

function Page() {
  return (
    <NonNotExistAccount>
      <NonNotExistMiner>
        <Ranking />
      </NonNotExistMiner>
    </NonNotExistAccount>
  )
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
