import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordSchema } from '@/schemas/password-schema'
import { useEffect, useState } from 'react'
import PasswordUpdated from './password-updated'
import { supabase } from '@/lib/supabase-client'
import { useNavigate } from 'react-router'

type Props = {}

type PasswordFields = z.infer<typeof passwordSchema>

const NewPasswordForm = ({ }: Props) => {

  const [isPasswordCreated, setIsPasswordCreated] = useState(false)
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  const navigate = useNavigate()


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFields>(
    {
      resolver: zodResolver(passwordSchema)
    }
  )

  const onSubmit: SubmitHandler<PasswordFields> = async (formData) => {

    // Atualiza a senha
    const { error } = await supabase.auth.updateUser({
      password: formData.password
    })

    if (error) {
      setError('root', { type: 'server', message: error.message })
      return
    }

    // Faz logout
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' })

    if (signOutError) {
      setError('root', { type: 'server', message: signOutError.message })
      return
    }

    setIsPasswordCreated(true)
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoverySession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (

    isPasswordCreated ? <PasswordUpdated /> : (
      <div className="flex flex-col gap-4 py-20 px-10">
        <h1 className='text-6xl font-bold'>Create a new password</h1>
        <h2 className='text-xl text-white font-normal brightness-60'>Choose a new password for yout account</h2>

        {errors.root?.message && (
          <p role="alert" className="text-sm text-destructive font-semibold">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-auto'>

          <div className='flex flex-col gap-2'>
            <p className='font-bold'>New Password</p>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your new password"
              className='bg-white p-3 border rounded-sm'
            />
            {errors.password && <span className=' text-sm text-destructive font-semibold'>{errors.password.message}</span>}
          </div>

          <div className='flex flex-col gap-2'>
            <p className='font-bold'>Confirm new password</p>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Enter your password"
              className='bg-white p-3 border rounded-sm'
            />
            {errors.confirmPassword && <span className=' text-sm text-destructive font-semibold'>{errors.confirmPassword.message}</span>}
          </div>

          <button disabled={isSubmitting}
            type="submit"
            className='flex items-center justify-center cursor-pointer gap-2 p-3 bg-accent/95 rounded-sm'
          >
            <p className={`text-base font-semibold ${isSubmitting ? 'hidden' : ''}`}>Change password</p>
            {isSubmitting ? <LoaderCircle className='animate-spin size-6' /> : <ArrowRight className='size-4' />}
          </button>
        </form>
      </div>
    )
  )
}

export default NewPasswordForm