import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthContext } from '@/context/auth-context'

export function RequireAuth() {
   const { user } = useAuthContext()

   if (!user) return <Navigate to="/login" replace />

   return <Outlet />
}

export function GuestOnly() {
   const { user } = useAuthContext()
   const location = useLocation()

   const isSignupConfirmation =
      location.pathname === '/login' &&
      new URLSearchParams(location.search).get('confirmed') === '1'

   if (user && !isSignupConfirmation) {
      return <Navigate to="/all-books" replace />
   }

   return <Outlet />
}
