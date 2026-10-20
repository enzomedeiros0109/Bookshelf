import BookCard from "../../book-card"
import SortBy from "../sort-by"

type Props = {}

const Read = (props: Props) => {
   return (
      <div className="flex flex-col gap-4 p-8">
         <div className="flex items-center justify-between">
            <div className="flex gap-4 items-end">
               <h1 className="font-bold text-4xl text-start">Read</h1>
               <p className="text-base text-white brightness-50">5 Books</p>
            </div>
            <SortBy />
         </div>
         <div className="grid grid-cols-3 gap-8">

            {Array.from({ length: 5 }).map((_, index) => (
               <BookCard />
            ))}
         </div>
      </div>
   )
}

export default Read
