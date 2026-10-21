import BookCard from "../../book-card"
import OutletHeader from "./outlet-header"

type Props = {}

const CurrentlyReading = (props: Props) => {
   return (
      <div className="flex flex-col gap-4 p-8">
         <OutletHeader />
         <div className="grid grid-cols-3 gap-8">

            {Array.from({ length: 5 }).map((_, index) => (
               <BookCard />
            ))}
         </div>
      </div>
   )
}

export default CurrentlyReading
