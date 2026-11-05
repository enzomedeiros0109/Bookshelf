import { AuthContext } from './context/auth-context'
import { supabase } from './lib/supabase-client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { AppRoutes } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

function App() {

  const [authState, setAuthState] = useState<{
    user: User | null
    loading: boolean
  }>({
    user: null,
    loading: true
  })

  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setAuthState({
        user: session?.user ?? null,
        loading: false
      })
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className='min-h-screen bg-background'>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authState}>
          {authState.loading ? (
            <div className='flex flex-col justify-center items-center min-h-screen'>
              <LoaderCircle className='animate-spin size-10' />
              Loading
            </div>
          ) : <AppRoutes />}
        </AuthContext.Provider>
      </QueryClientProvider>
    </div>
  )
}

export default App
