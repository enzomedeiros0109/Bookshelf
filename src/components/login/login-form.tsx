import { loginSchema } from '@/schemas/login-schema'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase-client'
import { useEffect } from 'react'

type Props = {}

type LoginFields = z.infer<typeof loginSchema>

const LoginForm = ({ }: Props) => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFields>(
    {
      resolver: zodResolver(loginSchema)
    }
  )

  const onSubmit: SubmitHandler<LoginFields> = async (formData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setError('root', { type: 'server', message: error.message })
      return
    }

    navigate('/all-books')
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' && session) {
        navigate('/all-books', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

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
          <Link
            to="/forgot-password"
          >
            <p className='text-right text-sm text-accent font-bold underline cursor-pointer'>Forgot password?</p>
          </Link>
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
        <button
          onClick={() => {
            navigate('/sign-up')
          }}
        >
          <p className='text-right text-sm text-accent font-bold cursor-pointer'>Sign up</p>
        </button>
      </div>
    </div>
  )
}

export default LoginForm
