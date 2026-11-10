import { LogOutIcon, SettingsIcon, User, UserIcon } from "lucide-react"
import SearchBar from "./search-bar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { supabase } from "@/lib/supabase-client"
import { useNavigate } from "react-router"
import { useAuthContext } from "@/context/auth-context"
import { getInitials } from "@/hooks/use-get-initials"

const Header = () => {

  const navigate = useNavigate()

  const handleLogOut = async () => {

    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error) return error.message

    navigate('/login')
  }

  const { user } = useAuthContext()
  const displayName =
    user?.user_metadata?.display_name || user?.user_metadata?.full_name

  return (
    <div className="flex gap-8 justify-end items-center min-w-auto h-20 bg-card px-8 border-b">

      <DropdownMenu>
        <DropdownMenuTrigger render={
          <div className="flex order-2 bg-accent p-2 w-10 rounded-full cursor-pointer justify-center">
            {getInitials(displayName) === '?' ? (
              <User className="size-6" />
            )
              :
              <p className="text-white">{getInitials(displayName)}</p>
            }


          </div>
        } />
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              navigate('/profile')
            }}
            className="cursor-pointer">
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate('/settings')}
            className="cursor-pointer">
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleLogOut}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="order-1">
        <SearchBar />
      </div>
    </div>
  )
}

export default Header
