import { useForm, type SubmitHandler } from 'react-hook-form'

type Props = {}

type LoginFields = {
  email: string,
  password: string,
}

const Login = (props: Props) => {

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>()

  const onSubmit: SubmitHandler<LoginFields> = (data) => {
    console.log(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className=" w-220 grid grid-cols-2">
        <div className="w-full h-full bg-[#f8f0e8]">Torla</div>
        <div className="flex flex-col w-full h-full bg-white brightness-98">
          <h1>Login</h1>
          <h2>Sign in to continue to your library.</h2>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

            <input {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email format"
              }
            })} type="text" placeholder="Email"
            />

            {errors.email && <span className=' text-sm text-destructive font-semibold'>{errors.email.message}</span>}

            <input {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters"
              },

            })} type="password" placeholder="Password" />

            {errors.password && <span className=' text-sm text-destructive font-semibold'>{errors.password.message}</span>}

            <button type="submit">submit</button>

          </form>

        </div>


      </div>
    </div>
  )
}

export default Login