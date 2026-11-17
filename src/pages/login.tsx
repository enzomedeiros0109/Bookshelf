import Logo from '@/components/layout/logo'

import { Outlet } from 'react-router'

const Login = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-300 grid grid-cols-2 shadow-lg rounded-2xl border bg-[linear-gradient(to_right,#f8f0e8_50%,#fdfcfa_50%)]">

        <div className="flex justify-center items-center">
          <Logo iconsize='size-30' textsize='text-7xl' isCol={true}/>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default Login
