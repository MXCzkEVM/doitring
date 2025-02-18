import { ReactNode } from 'react'
import Layout from '@/layout'
import { Invitation } from '@/ui/rewards/Invitation'

function Page() {
  return (
    <div className="m-17px">
      <Invitation />
    </div>
  )
}

Page.layout = function layout(page: ReactNode) {
  return <Layout showNavbar navbarProps={{ back: true }}>{page}</Layout>
}
export default Page
