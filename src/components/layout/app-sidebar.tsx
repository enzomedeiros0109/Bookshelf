import { Book, Bookmark, BookOpen, Check, Save, Star } from "lucide-react"
import { Link } from "react-router"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import Logo from "./logo"
import AppSideBarFooter from "./app-sidebar-footer"

type Props = {}

const items = [
   {
      title: "All Books",
      icon: Book,
   },
   {
      title: "Currently Reading",
      icon: BookOpen,
   },
   {
      title: "Want to Read",
      icon: Bookmark,
   },
   {
      title: "Read",
      icon: Check,
   },
   {
      title: "Favorites",
      icon: Star,
   }
]

const AppSideBar = (props: Props) => {
   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup className="gap-8 p-4">
               <Logo />
               {/* <SearchBar className="h-11" /> */}
            </SidebarGroup>

            <nav
               aria-label="Library"
               className="mt-4 px-4"
            >
               <p className="text-sm font-semibold">LIBRARY</p>
               <SidebarMenu className="mt-4 gap-1">
                  {items.map((option) => (
                     <SidebarMenuItem
                        key={option.title}
                     >
                        {option.title === "All Books" ? (
                           <Link to="/all-books" className="flex transform transition-all duration-500 min-h-12 w-full items-center gap-4 px-2 hover:bg-accent/25 hover:text-accent hover:scale-110 hover:border-l-4 hover:border-accent">
                              <option.icon aria-hidden="true" className="size-5" />
                              <p>{option.title}</p>
                           </Link>
                        ) : (
                           <a href="" className="flex transform transition-all duration-500 min-h-12 w-full items-center gap-4 px-2 hover:bg-accent/25 hover:text-accent hover:scale-110 hover:border-l-4 hover:border-accent">
                              <option.icon aria-hidden="true" className="size-5" />
                              <p>{option.title}</p>
                           </a>
                        )}
                     </SidebarMenuItem>
                  ))}
               </SidebarMenu>
            </nav>
         </SidebarContent>
         <SidebarFooter className="pb-8">
            <SidebarMenu>
               <SidebarMenuItem>
                  <AppSideBarFooter />
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   )
}

export default AppSideBar
