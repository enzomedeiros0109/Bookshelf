import { Book } from 'lucide-react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='bg-accent p-3 rounded-md'>
         <Book className='size-5 text-white'/>
      </div>
      <h1 className='text-3xl italic'>Bookshelf</h1>
    </div>
  )
}

export default Logo
