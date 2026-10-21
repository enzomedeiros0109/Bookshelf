import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { emailSchema } from '@/schemas/email-schema'

type Props = {}

type emailField = z.infer<typeof emailSchema>

const ForgotPasswordForm = ({ }: Props) => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<emailField>(
    {
      resolver: zodResolver(emailSchema)
    }
  )

  const onSubmit: SubmitHandler<emailField> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-4 py-20 px-10">
      <h1 className='text-6xl font-bold'>Forgot Password</h1>
      <h2 className='text-xl text-white font-normal brightness-60'>Enter your email to receive a code</h2>

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

        <button disabled={isSubmitting} type="submit"
          className='flex items-center justify-center cursor-pointer gap-2 p-2 bg-accent/95 rounded-sm'
        >
          <p className={`text-base font-semibold ${isSubmitting ? 'hidden' : ''}`}>Send code</p>
          {isSubmitting ? <LoaderCircle className='animate-spin size-6' /> : <ArrowRight className='size-4' />}
        </button>

      </form>

      <div className='flex gap-2 items-center justify-center'>
        <button
          onClick={() => {
            navigate('/login')
          }}
        >
          <p className='text-right text-sm text-accent underline font-bold cursor-pointer'>Back to login</p>
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordForm