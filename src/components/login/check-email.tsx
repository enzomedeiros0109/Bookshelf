import { ArrowLeft, Info } from 'lucide-react'
import { useNavigate } from 'react-router'

type Props = {}

const CheckEmail = ({ }: Props) => {

   const navigate = useNavigate()

   return (
      <div className="flex flex-col gap-3 justify-center items-center">

         

         <h1 className='text-5xl font-bold'>Check your email</h1>
         <h2 className='text-lg text-white text-center font-normal brightness-60'>We've sent you a password reset link to you@example.com.</h2>
         <h2 className='text-lg text-white text-center font-normal brightness-60'>Click the link in the email to set a new password.</h2>

         <div className='flex gap-2 p-4 items-center justify-start rounded-md bg-accent'>
            <Info className='size-6 '/>
            <div className='flex flex-col'>
               <p className='text-sm'>The link will expire in one hour</p>
               <p className='text-sm font-semibold'>If you don't see the email, check your spam folder</p>
            </div>
         </div>



         <div className='flex gap-2 items-center self-start p-4'>
            <ArrowLeft className='text-accent size-4'/>
            <button
               onClick={() => {
                  navigate('/login')
               }}
            >
               <p className='text-sm text-accent underline font-bold cursor-pointer'>Back to login</p>
            </button>
         </div>
      </div>
   )
}

export default CheckEmail