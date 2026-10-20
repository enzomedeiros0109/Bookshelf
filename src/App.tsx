import { useState } from 'react'
import Home from './pages/home'
import { Route, Routes } from 'react-router'
import NotFound from './pages/not-found'
import Landing from './pages/landing'
import AllBooks from './components/layout/all-books'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen bg-background'>
      <Routes>
        <Route element={<Home />}>

          <Route path='/all-books' element={<AllBooks />} />
        </Route>

        <Route path='/' element={<Landing />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
