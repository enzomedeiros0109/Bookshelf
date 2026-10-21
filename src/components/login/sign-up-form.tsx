import { signUpSchema } from '@/schemas/sign-up-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'

type Props = {}

type SignUpFields = z.infer<typeof signUpSchema>

const SignUpForm = ({ }: Props) => {

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting } } = useForm<SignUpFields>({
         resolver: zodResolver(signUpSchema)
      })

   const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
      try {
         await new Promise((resolve) => setTimeout(resolve, 2000))
         console.log(data)
      } catch (error) {
         setError("email", {
            message: "This email is already taken",
         })
      }
   }

   return (
      <div className="flex flex-col gap-4 py-20 px-10">
         <h1 className='text-6xl font-bold'>Create account</h1>
         <h2 className='text-xl text-white font-normal brightness-60'>Sign in to continue to your library.</h2>

         <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-auto'>

            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Full name</p>
               <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Enter your full name"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.email && <span className=' text-sm text-destructive font-semibold'>{errors.fullName?.message}</span>}
            </div>

            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Email</p>
               <input
                  {...register("email")}
                  type="text"
                  placeholder="you@email.com"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.email && <span className=' text-sm text-destructive font-semibold'>{errors.email.message}</span>}
            </div>

            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Password</p>
               <input
                  {...register("password")}
                  type="password"
                  placeholder="Enter your password"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.password && <span className=' text-sm text-destructive font-semibold'>{errors.password.message}</span>}
            </div>

            <div className='flex flex-col gap-2'>
               <p className='font-bold'>Confirm Password</p>
               <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Enter your password"
                  className='bg-white p-3 border rounded-sm'
               />
               {errors.confirmPassword?.message && <span className=' text-sm text-destructive font-semibold'>{errors.confirmPassword?.message}</span>}
            </div>

            <div className='flex justify-start items-center'>
               <button>
                  <p className='text-right text-sm text-accent font-bold underline cursor-pointer'>Forgot password?</p>
               </button>
            </div>

            <button disabled={isSubmitting} type="submit"
               className='flex items-center justify-center cursor-pointer gap-2 p-2 bg-accent/95 rounded-sm'
            >
               <p className={`text-base font-semibold ${isSubmitting ? 'hidden' : ''}`}>Create account</p>
               {isSubmitting ? <LoaderCircle className='animate-spin size-6' /> : <ArrowRight className='size-4' />}
            </button>

         </form>

         <div className='flex gap-2 items-center justify-center'>
            <p className='text-sm text-white brightness-50'>Already have an account?</p>
            <button>
               <p className='text-right text-sm text-accent font-bold cursor-pointer'>Log in</p>
            </button>
         </div>
      </div>
   )
}

export default SignUpForm