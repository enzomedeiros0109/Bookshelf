import BookCard from "../../book-card"
import SortBy from "../sort-by"
import OutletHeader from "./outlet-header"

type Props = {}

const AllBooks = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <OutletHeader />
      <div className="grid grid-cols-3 gap-8">

        {Array.from({ length: 9 }).map((_, index) => (
          <BookCard />
        ))}
      </div>
    </div>
  )
}

export default AllBooks
