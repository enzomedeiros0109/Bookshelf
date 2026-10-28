import { useQuery } from "@tanstack/react-query"
import OutletHeader from "./outlet-header"
import { getBooks } from "@/api/api"
import type { BookSchema } from "@/schemas/db/books-schema"

type Props = {}

const AllBooks = ({ }: Props) => {

  return (
    <div className="flex flex-col gap-4 p-8">
      <OutletHeader />
      <div className="grid grid-cols-3 gap-8">
      </div>
    </div>
  )
}

export default AllBooks
