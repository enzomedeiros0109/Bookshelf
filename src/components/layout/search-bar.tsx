import { Search } from "lucide-react"
import { cn } from "cn"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

type Props = { className?: string }

const SearchBar = ({ className }: Props) => {
  return (
    <InputGroup className={cn("rounded-md", className)}>
      <InputGroupInput placeholder="Search books..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}

export default SearchBar
