import { LogOutIcon, SettingsIcon, User, UserIcon } from "lucide-react"
import SearchBar from "./search-bar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { supabase } from "@/lib/supabase-client"
import { useNavigate } from "react-router"

const Header = () => {

  const navigate = useNavigate()

  const handleLogOut = async () => {

    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error) return error.message

    navigate('/login')
  }

  return (
    <div className="flex gap-8 justify-end items-center min-w-auto h-20 bg-card px-8 border-b">


      <DropdownMenu>
        <DropdownMenuTrigger render={
          <div className="order-2 bg-accent p-2 rounded-full cursor-pointer">
            <User className="size-6" />
          </div>
        } />
        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
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