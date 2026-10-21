import { loginSchema } from '@/schemas/login-schema'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {}

type LoginFields = z.infer<typeof loginSchema>

const LoginForm = ({ }: Props) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFields>(
    {
      resolver: zodResolver(loginSchema)
    }
  )

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-4 py-20 px-10">
      <h1 className='text-6xl font-bold'>Login</h1>
      <h2 className='text-xl text-white font-normal brightness-60'>Sign in to continue to your library.</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-auto'>

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

        <div className='flex justify-start items-center'>
          <button>
            <p className='text-right text-sm text-accent font-bold underline cursor-pointer'>Forgot password?</p>
          </button>
        </div>

        <button disabled={isSubmitting} type="submit"
          className='flex items-center justify-center cursor-pointer gap-2 p-2 bg-accent/95 rounded-sm'
        >
          <p className={`text-base font-semibold ${isSubmitting ? 'hidden' : ''}`}>Log in</p>
          {isSubmitting ? <LoaderCircle className='animate-spin size-6' /> : <ArrowRight className='size-4' />}
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

export default LoginForm