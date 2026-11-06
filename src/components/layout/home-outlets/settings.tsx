import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, WholeWord, WholeWordIcon } from "lucide-react"

type Props = {}

const Settings = (props: Props) => {

  const items = [
    { label: "Select a language", value: null },
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
  ]

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-4xl font-bold">Settings</h1>
      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-2 border rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl p-3 text-nowrap">Name</h1>
            <div className="flex p-3">
              <form className="flex gap-4" action="submit">
                <input className="w-50 rounded-md border pl-1" type="text" placeholder="New name" />
                <button className="bg-accent p-2 rounded-md text-white">Save changes</button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl p-3 text-nowrap">New password</h1>
            <div className="flex p-3">
              <form className="flex gap-4" action="submit">
                <input className="w-50 rounded-md border pl-1" type="text" placeholder="Torla 2015" />
                <button className="bg-accent p-2 rounded-md text-white">Save changes</button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl p-3 text-nowrap">Language</h1>
            <div className="flex p-3">
              <Select items={items}>
                <SelectTrigger className="w-full max-w-48">
                  <Globe />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Settings