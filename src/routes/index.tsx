import { Route, Routes } from 'react-router'
import { GuestOnly, RequireAuth } from './route-guards'
import Login from '@/pages/login'
import LoginForm from '@/components/login/login-form'
import SignUpForm from '@/components/login/sign-up-form'
import CheckEmail from '@/components/login/check-email'
import ForgotPasswordForm from '@/components/login/forgot-password'
import NewPasswordForm from '@/components/login/new-password-form'
import NotFound from '@/pages/not-found'
import Favorites from '@/components/layout/home-outlets/favorites'
import WantToRead from '@/components/layout/home-outlets/want-to-read'
import CurrentlyReading from '@/components/layout/home-outlets/currently-reading'
import AllBooks from '@/components/layout/home-outlets/all-books'
import Read from '@/components/layout/home-outlets/read'
import Landing from '@/pages/landing'
import Home from '@/pages/home'

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
               <Route
                  path="/forgot-password/check-email"
                  element={<CheckEmail isPasswordReset={true} />}
               />
            </Route>
         </Route>

         <Route element={<Login />}>
            <Route
               path="/forgot-password/new-password"
               element={<NewPasswordForm />}
            />
         </Route>

         <Route element={<RequireAuth />}>
            <Route element={<Home />}>
               <Route path="/all-books" element={<AllBooks />} />
               <Route path="/currently-reading" element={<CurrentlyReading />} />
               <Route path="/want-to-read" element={<WantToRead />} />
               <Route path="/read" element={<Read />} />
               <Route path="/favorites" element={<Favorites />} />
            </Route>
         </Route>

         <Route path="*" element={<NotFound />} />
      </Routes>
   )
}
