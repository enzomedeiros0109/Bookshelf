import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Props = {}

const items = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Title A-Z", value: "a-z" },
  { label: "Title Z-A", value: "z-a" },
  { label: "Recently added", value: "recently-added" },
]

const SortBy = (props: Props) => {
   return (
      <Select items={items}>
         <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder={`Sort By: ${items[0].label}`} />
         </SelectTrigger>
         <SelectContent>
            <SelectGroup>
               {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                     {item.label}
                  </SelectItem>
               ))}
            </SelectGroup>
         </SelectContent>
      </Select>
   )
}

export default SortBy