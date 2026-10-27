import Logo from "@/components/layout/logo"
import { useNavigate } from "react-router"
import BackgroundImage from '../assets/landing.png'

type Props = {}

const Landing = ({ }: Props) => {

   const navigate = useNavigate()

   return (
      <div
         style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100%'
         }}
         className='flex flex-col min-h-screen'>

         <div className="flex self-start p-10">
            <Logo iconsize="size-6" textsize="text-4xl" />
         </div>
         <div className="flex flex-col gap-4 p-10 mt-10">
            <h1 className="whitespace-pre-line text-6xl font-bold">
               {
                  `Discover. Organize.
                     Keep Reading.`
               }
            </h1>
            <h2 className="text-wrap font-normal text-white brightness-30">
               Booshelf helps you track your reading, set goals, and build a collection of the books you love
            </h2>
         </div>
         <div className="flex gap-8 px-10">
            <button
               className="bg-accent px-6 py-2 rounded-sm cursor-pointer"
               onClick={() => {
                  navigate('/sign-up')
               }}
            >
               Get Started
            </button>
            <button
               className="bg-background px-6 p-2 rounded-sm border-2 border-accent cursor-pointer"
               onClick={() => {
                  navigate('/login')
               }}
            >
               Sign In
            </button>
         </div>
      </div>
   )
}

export default Landing