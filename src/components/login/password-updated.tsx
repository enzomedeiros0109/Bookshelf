import { Check } from 'lucide-react'
import { useNavigate } from 'react-router'

const PasswordUpdated = () => {

   const navigate = useNavigate()

   return (
      <div className="flex flex-col gap-3 justify-center items-center p-20">

         <div className='flex bg-accent/80 p-4 items-center rounded-full'>
            <Check className='size-15' />
         </div>

         <h1 className='text-5xl font-bold text-center text-nowrap'>Password updated</h1>
         <div className='flex flex-col'>
            <h2 className='text-lg text-white text-center font-normal brightness-20 text-nowrap'>Your password has been successfully updated.</h2>
            <h2 className='text-lg text-white text-center font-normal brightness-20'>You can now log in to your account</h2>
         </div>

         <button type="submit"
            className='flex items-center justify-center cursor-pointer gap-2 py-2 w-full bg-accent/95 rounded-sm mt-5'
            onClick={() => {
               navigate('/login')
            }}
         >
            <p className={`text-base font-semibold`}>Go to log in</p>
         </button>
      </div>
   )
}

export default PasswordUpdated
