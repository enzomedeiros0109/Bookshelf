import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthContext } from '@/context/auth-context'
import { LoaderCircle } from 'lucide-react'

export function RequireAuth() {
   const { user, loading } = useAuthContext()

   if (loading) return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
         <LoaderCircle className='animate-spin size-10' />
         Loading
      </div>
   )
   if (!user) return <Navigate to="/login" replace />

   return <Outlet />
}

export function GuestOnly() {
   const { user, loading } = useAuthContext()
   const location = useLocation()

   if (loading) return
   (
      <div className='flex flex-col justify-center items-center min-h-screen'>
         <LoaderCircle className='animate-spin size-10' />
         Loading
      </div>
   )

   const isSignupConfirmation =
      location.pathname === '/login' &&
      new URLSearchParams(location.search).get('confirmed') === '1'

   if (user && !isSignupConfirmation) {
      return <Navigate to="/all-books" replace />
   }

   return <Outlet />
}