import { ArrowLeft, Info } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import BookCheckEmail from '../../assets/bookshelf_check_email_icon.svg'

type Props = {
   isPasswordReset: boolean
}

const CheckEmail = ({ isPasswordReset }: Props) => {

   const navigate = useNavigate()
   const { state } = useLocation()
   const email = state?.email ?? 'your email address'

   return (
      <div className="flex flex-col gap-3 justify-center items-center">

         <img
            src={BookCheckEmail}
            alt="Book Check Email Icon"
            className='size-70'
         />

         <h1 className='text-5xl font-bold'>Check your email</h1>
         {isPasswordReset ? (
            <>
               <h2 className='text-lg text-white text-center font-normal brightness-20'>We've sent you a password reset link to {email}.</h2>
               <h2 className='text-lg text-white text-center font-normal brightness-20'>Click the link in the email to set a new password.</h2>

               <div className='flex gap-2 p-4 items-center justify-start rounded-md bg-accent'>
                  <Info className='size-6 ' />
                  <div className='flex flex-col'>
                     <p className='text-sm'>The link will expire in one hour</p>
                     <p className='text-sm font-semibold'>If you don't see the email, check your spam folder</p>
                  </div>
               </div>
            </>
         ) : (
            <>
               <h2 className='text-lg text-white text-center font-normal brightness-20'>We've sent you a verification link to {email}.</h2>
               <h2 className='text-lg text-white text-center font-normal brightness-20'>Click the link in the email to verificate your account.</h2>

               <div className='flex gap-2 p-4 items-center justify-start rounded-md bg-accent'>
                  <Info className='size-6 ' />
                  <div className='flex flex-col'>
                     <p className='text-sm'>The link will expire in one hour</p>
                     <p className='text-sm font-semibold'>If you don't see the email, check your spam folder</p>
                  </div>
               </div>
            </>
         )}



         <div className='flex gap-3 items-center self-start p-4'>
            <ArrowLeft className='text-accent size-5' />
            <button
               onClick={() => {
                  navigate('/login')
               }}
            >
               <p className='text-base text-accent font-bold cursor-pointer'>Back to login</p>
            </button>
         </div>
      </div>
   )
}

export default CheckEmail