import Home from './pages/home'
import { Route, Routes } from 'react-router'
import NotFound from './pages/not-found'
import Landing from './pages/landing'
import AllBooks from './components/layout/home-outlets/all-books'
import CurrentlyReading from './components/layout/home-outlets/currently-reading'
import Favorites from './components/layout/home-outlets/favorites'
import Read from './components/layout/home-outlets/read'
import WantToRead from './components/layout/home-outlets/want-to-read'
import Login from './pages/login'
import LoginForm from './components/login/login-form'
import SignUpForm from './components/login/sign-up-form'
import ForgotPasswordForm from './components/login/forgot-password'
import CheckEmail from './components/login/check-email'
import NewPasswordForm from './components/login/new-password-form'
import { AuthContext } from './context/auth-context'
import { supabase } from './lib/supabase-client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

function App() {

  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user)
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className='min-h-screen bg-background'>
      <AuthContext.Provider value={user}>
        <Routes>
          <Route element={<Home />}>

            <Route path='/all-books' element={<AllBooks />} />
            <Route path="/currently-reading" element={<CurrentlyReading />} />
            <Route path="/want-to-read" element={<WantToRead />} />
            <Route path="/read" element={<Read />} />
            <Route path="/favorites" element={<Favorites />} />

          </Route>

          <Route element={<Login />} >
            <Route path='/login' element={<LoginForm />} />
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/forgot-password' element={<ForgotPasswordForm />} />
            <Route path='/forgot-password/check-email' element={<CheckEmail />} />
            <Route path='/forgot-password/new-password' element={<NewPasswordForm />} />
          </Route>
          <Route path='/' element={<Landing />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  )
}

export default App
