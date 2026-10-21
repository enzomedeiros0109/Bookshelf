import { useState } from 'react'
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

function App() {

  return (
    <div className='min-h-screen bg-background'>
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
          <Route path='/sign-up' element={<LoginForm />} />
          <Route path='/forgot-password' element={<LoginForm />} />
          <Route path='/forgot-password/email-code' element={<LoginForm />} />
        </Route>
        <Route path='/' element={<Landing />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
