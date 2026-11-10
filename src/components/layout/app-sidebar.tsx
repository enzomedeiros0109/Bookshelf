import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Book, Bookmark, BookOpen, ChartColumn, Check, Star } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { getReadingGoalSummary, saveReadingGoal, type ReadingGoalSummary } from "@/api/supabase"
import { useAuthContext } from "@/context/auth-context"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem } from "../ui/sidebar"
import Logo from "./logo"
import AppSideBarFooter from "./app-sidebar-footer"
import ReadingGoalDialog from "./reading-goal-dialog"

const items = [
   { title: "All Books", icon: Book, path: "/all-books" },
   { title: "Currently Reading", icon: BookOpen, path: "/currently-reading" },
   { title: "Want to Read", icon: Bookmark, path: "/want-to-read" },
   { title: "Read", icon: Check, path: "/read" },
   { title: "Favorites", icon: Star, path: "/favorites" },
   { title: "Charts", icon: ChartColumn, path: "/charts" },
]


const AppSideBar = () => {

   const navigate = useNavigate()
   const { user } = useAuthContext()
   const queryClient = useQueryClient()
   const year = new Date().getFullYear()
   const [goalDialogOpen, setGoalDialogOpen] = useState(false)
   const [goalSaveError, setGoalSaveError] = useState<string | null>(null)
   const goalQuery = useQuery({
      queryKey: ["reading-goal", user?.id, year],
      queryFn: () => getReadingGoalSummary(year),
      enabled: Boolean(user?.id),
   })
   const goalMutation = useMutation({
      mutationFn: (goalBooks: number) => saveReadingGoal(year, goalBooks),
      onSuccess: async (savedGoalBooks) => {
         setGoalSaveError(null)
         queryClient.setQueryData<ReadingGoalSummary>(
            ["reading-goal", user?.id, year],
            (current) => ({
               booksRead: current?.booksRead ?? 0,
               goalBooks: savedGoalBooks,
               year,
            }),
         )
         await queryClient.invalidateQueries({
            queryKey: ["reading-goal", user?.id, year],
         })
         setGoalDialogOpen(false)
      },
      onError: (error) => {
         setGoalSaveError(
            error instanceof Error ? error.message : "Could not save your reading goal.",
         )
      },
   })

   const handleOpenGoalDialog = () => {
      setGoalSaveError(null)
      goalMutation.reset()
      setGoalDialogOpen(true)
   }

   const handleSaveGoal = (goalBooks: number) => {
      setGoalSaveError(null)
      goalMutation.mutate(goalBooks)
   }

   const booksRead = goalQuery.data?.booksRead ?? 0
   const goalBooks = goalQuery.data?.goalBooks ?? 0
   const displayedBooksRead =
      goalQuery.isLoading && !goalQuery.data
         ? "…"
         : goalQuery.isError && !goalQuery.data
            ? "—"
            : booksRead
   const displayedGoalBooks =
      goalQuery.isLoading && !goalQuery.data
         ? "…"
         : goalQuery.isError && !goalQuery.data
            ? "—"
            : goalBooks
   const progressPercent =
      goalBooks > 0 ? Math.min(100, Math.round((booksRead / goalBooks) * 100)) : 0
   const booksToGo = Math.max(0, goalBooks - booksRead)

   const progressMessage = goalQuery.isLoading
      ? "Loading reading goal..."
      : goalQuery.isError
         ? goalQuery.data
            ? "Could not refresh reading goal."
            : "Could not load reading goal."
         : goalBooks === 0
            ? "Set a goal to track progress"
            : `${progressPercent}% complete - ${booksToGo} books to go`
   const footerMessage = goalSaveError ?? progressMessage

   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup className="gap-8 p-4">
               <button className="cursor-pointer"
                  onClick={() => {
                     navigate('/')
                  }}
               >
                  <Logo />
               </button>
            </SidebarGroup>

            <nav
               aria-label="Library"
               className="mt-4 px-4"
            >
               <p className="text-sm font-semibold">LIBRARY</p>
               <SidebarMenu className="mt-4 gap-1">
                  {items.map((option) => (
                     <SidebarMenuItem
                        key={option.path}
                     >
                        <Link to={option.path} className="flex transform transition-all duration-500 min-h-12 w-full items-center gap-4 px-2 hover:bg-accent/25 hover:text-accent hover:scale-110 hover:border-l-4 hover:border-accent">
                           <option.icon aria-hidden="true" className="size-5 shrink-0" />
                           <p>{option.title}</p>
                        </Link>

                     </SidebarMenuItem>
                  ))}
               </SidebarMenu>
            </nav>
         </SidebarContent>

         <SidebarFooter className="relative pb-8">
            {goalDialogOpen && (
               <ReadingGoalDialog
                  year={year}
                  goalBooks={goalBooks}
                  isSaving={goalMutation.isPending}
                  saveError={goalSaveError}
                  onClose={() => setGoalDialogOpen(false)}
                  onSave={handleSaveGoal}
               />
            )}
            <SidebarMenu>
               <SidebarMenuItem>
                  <AppSideBarFooter
                     year={year}
                     displayedBooksRead={displayedBooksRead}
                     displayedGoalBooks={displayedGoalBooks}
                     progressPercent={progressPercent}
                     progressMessage={footerMessage}
                     hasError={Boolean(goalQuery.isError || goalSaveError)}
                     isLoading={goalQuery.isLoading}
                     onEditGoal={handleOpenGoalDialog}
                  />
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   )
}

export default AppSideBar
