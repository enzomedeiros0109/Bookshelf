import { AuthContext } from './context/auth-context'
import { supabase } from './lib/supabase-client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { AppRoutes } from './routes'

function App() {

  const [authState, setAuthState] = useState<{
    user: User | null
    loading: boolean
  }>({
    user: null,
    loading: true
  })

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
      <AuthContext.Provider value={authState}>
        {authState.loading ? <div>Loading...</div> : <AppRoutes />}
      </AuthContext.Provider>
    </div>
  )
}

export default App
