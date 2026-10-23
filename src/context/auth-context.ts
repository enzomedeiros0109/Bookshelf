import type { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export const AuthContext = createContext<User | undefined>(undefined)

export function useAuthContext() {
   const user = useContext(AuthContext)

   if (user === undefined) {
      throw new Error('useAuthContext must be used with a AuthContext')
   }

   return user
}