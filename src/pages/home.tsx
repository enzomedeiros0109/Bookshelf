import { SidebarProvider } from '@/components/ui/sidebar'
import Header from '../components/layout/header'
import AppSideBar from '@/components/layout/app-sidebar'
import { Outlet } from 'react-router'

type Props = {}

const Home = ({}: Props) => {
  return (
    <div >
      <SidebarProvider>
        <AppSideBar />
        <main className='min-w-0 flex-1'>
            <Header />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Home
