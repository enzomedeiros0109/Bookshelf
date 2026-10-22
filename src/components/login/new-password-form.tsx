import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordSchema } from '@/schemas/password-schema'
import { useState } from 'react'
import PasswordUpdated from './password-updated'

type Props = {}

type PasswordFields = z.infer<typeof passwordSchema>

const NewPasswordForm = ({ }: Props) => {

  const [isPasswordCreated, setIsPasswordCreated] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFields>(
    {
      resolver: zodResolver(passwordSchema)
    }
  )

  const onSubmit: SubmitHandler<PasswordFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
  }

  return (

    isPasswordCreated ? <PasswordUpdated /> : (
      <div className="flex flex-col gap-4 py-20 px-10">
        <h1 className='text-6xl font-bold'>Create a new password</h1>
        <h2 className='text-xl text-white font-normal brightness-60'>Choose a new password for yout account</h2>

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
            onClick={() => {
              setIsPasswordCreated(true)
            }}
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