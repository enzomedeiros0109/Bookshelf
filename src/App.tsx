import { useState } from 'react'
import Home from './pages/home'
import { Route, Routes } from 'react-router'
import NotFound from './pages/not-found'
import Landing from './pages/landing'
import AllBooks from './components/layout/outlets/all-books'
import CurrentlyReading from './components/layout/outlets/currently-reading'
import Favorites from './components/layout/outlets/favorites'
import Read from './components/layout/outlets/read'
import WantToRead from './components/layout/outlets/want-to-read'

function App() {
  const [count, setCount] = useState(0)

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

        <Route path='/' element={<Landing />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
