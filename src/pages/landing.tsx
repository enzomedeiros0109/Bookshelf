import { LoaderCircle } from 'lucide-react'

type Props = {}

const Landing = ({}: Props) => {
   return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
         LANDING PAGE
         <LoaderCircle className='animate-spin size-10'/>
      </div>
   )
}

export default Landing