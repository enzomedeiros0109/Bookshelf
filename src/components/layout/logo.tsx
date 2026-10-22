import { Book } from 'lucide-react'

type Props = {
  iconsize?: string,
  textsize?: string,
  isCol?: boolean,
}

const Logo = ({ iconsize, textsize, isCol }: Props) => {
  return (
    <div className={`flex ${isCol ? 'flex-col gap-10' : ''} items-center gap-3`}>
      <div className='bg-accent p-3 rounded-md'>
        <Book className={`text-white ${iconsize ?? 'size-5'}`} />
      </div>
      <h1 className={`${textsize ?? 'text-3xl'} italic`}>Bookshelf</h1>    </div>
  )
}

export default Logo
