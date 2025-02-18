import { PropsWithChildren } from 'react'
import { DetailedHTMLProps } from '@hairy/react-utils'
import classNames from 'classnames'
import { Alert } from 'antd'
import Main from './components/Main'
import Tabbar, { TabbarProps } from './components/Tabbar'
import Navbar, { NavbarProps } from './components/Navbar'
import { PageTransitionEffect } from '@/components'

export interface LayoutProps extends DetailedHTMLProps {
  showTabbar?: boolean
  showNavbar?: boolean
  navbarProps?: NavbarProps
  tabbarProps?: TabbarProps
}

export default function Layout(props: PropsWithChildren<LayoutProps>) {
  return (
    <div className={classNames(['layout font-[Merriweather] min-h-screen flex-col max-w-xl mx-auto bg-[#070A0F] text-white relative', props.className])}>
      {props.showNavbar && <Navbar {...props.navbarProps} />}
      <PageTransitionEffect>
        <Main children={props.children} />
      </PageTransitionEffect>
      <div className="pt-70px" />
      {props.showTabbar && <Tabbar {...props.tabbarProps} />}
    </div>
  )
}
