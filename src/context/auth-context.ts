import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const AuthContext = createContext<User | undefined>(undefined)