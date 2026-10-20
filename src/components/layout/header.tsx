import { User } from "lucide-react"
import SearchBar from "./search-bar"

const Header = () => {
  return (
    <div className="flex gap-8 justify-end items-center min-w-auto h-20 bg-card px-8 border-b">
      <div className="order-2 bg-accent p-2 rounded-full">
         <User className="size-6"/>
      </div>
      <div className="order-1">
         <SearchBar />
      </div>
    </div>
  )
}

export default Header