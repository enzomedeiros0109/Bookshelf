import { ArrowRight } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

type Props = {}

type LoginFields = {
   fullName: string,
   email: string,
   password: string,
}

const SignUpForm = ({ }: Props) => {

   const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>()

   const onSubmit: SubmitHandler<LoginFields> = (data) => {
      console.log(data)
   }

   return (
      <div className="flex flex-col gap-4 py-20 px-10">
         <h1 className='text-6xl font-bold'>Login</h1>
         <h2 className='text-xl text-white font-normal brightness-60'>Sign in to continue to your library.</h2>

         <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-auto'>

            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Email</p>
               <input {...register("email", {
                  required: "Email is required",
                  pattern: {
                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                     message: "Enter a valid email format"
                  }
               })} type="text" placeholder="you@email.com"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.email && <span className=' text-sm text-destructive font-semibold'>{errors.email.message}</span>}
            </div>
            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Password</p>
               <input {...register("password", {
                  required: "Password is required",
                  minLength: {
                     value: 8,
                     message: "Password must have at least 8 characters"
                  },
               })} type="password" placeholder="Enter your password"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.password && <span className=' text-sm text-destructive font-semibold'>{errors.password.message}</span>}
            </div>

            <div className='flex justify-start items-center'>
               <button>
                  <p className='text-right text-sm text-accent font-bold underline cursor-pointer'>Forgot password?</p>
               </button>
            </div>

            <button type="submit"
               className='flex items-center justify-center gap-2 p-2 bg-accent/95 rounded-sm'
            >
               <p className='text-base font-semibold'>Log In</p>
               <ArrowRight className='size-4' />
            </button>

         </form>

         <div className='flex gap-2 items-center justify-center'>
            <p className='text-sm text-white brightness-50'>Don't have an account?</p>
            <button>
               <p className='text-right text-sm text-accent font-bold cursor-pointer'>Sign up</p>
            </button>
         </div>
      </div>
   )
}

export default SignUpForm