import { SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/components/layout/header'
import AppSideBar from '@/components/layout/app-sidebar'
import { Outlet } from 'react-router'

type Props = {}

const Home = ({}: Props) => {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSideBar />
      <main className="flex h-svh min-w-0 flex-1 flex-col">
        <div className="shrink-0">
          <Header />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Home
