import { Route, Routes } from 'react-router'
import { GuestOnly, RequireAuth } from './route-guards'
import Login from '@/pages/login'
import LoginForm from '@/components/login/login-form'
import SignUpForm from '@/components/login/sign-up-form'
import CheckEmail from '@/components/login/check-email'
import ForgotPasswordForm from '@/components/login/forgot-password'
import NewPasswordForm from '@/components/login/new-password-form'
import NotFound from '@/pages/not-found'
import Favorites from '@/pages/app/favorites'
import WantToRead from '@/pages/app/want-to-read'
import CurrentlyReading from '@/pages/app/currently-reading'
import AllBooks from '@/pages/app/all-books'
import Read from '@/pages/app/read'
import Landing from '@/pages/landing'
import Home from '@/pages/app/home'
import BookDetail from '@/pages/app/book-detail'
import Settings from '@/pages/app/settings'
import Profile from '@/pages/app/profile'
import Charts from '@/pages/app/charts'

type Props = {}

export const AppRoutes = ({ }: Props) => {

   return (
      <Routes>
         <Route path="/" element={<Landing />} />

         <Route element={<GuestOnly />}>
            <Route element={<Login />}>
               <Route path="/login" element={<LoginForm />} />
               <Route path="/sign-up" element={<SignUpForm />} />
               <Route path="/check-email" element={<CheckEmail isPasswordReset={false} />} />
               <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            </Route>
         </Route>

         <Route element={<Login />}>
            <Route
               path="/forgot-password/check-email"
               element={<CheckEmail isPasswordReset={true} />}
            />
            <Route
               path="/forgot-password/new-password"
               element={<NewPasswordForm />}
            />
         </Route>

         <Route element={<RequireAuth />}>
            <Route element={<Home />}>
               <Route path="/all-books" element={<AllBooks />} />
               <Route path="/books/:externalId" element={<BookDetail />} />
               <Route path="/currently-reading" element={<CurrentlyReading />} />
               <Route path="/want-to-read" element={<WantToRead />} />
               <Route path="/read" element={<Read />} />
               <Route path="/favorites" element={<Favorites />} />
               <Route path="/charts" element={<Charts />} />
               <Route path='/settings' element={<Settings />} />
               <Route path='profile' element={<Profile />}/>
            </Route>
         </Route>

         <Route path="*" element={<NotFound />} />
      </Routes>
   )
}
