import SortBy from "../sort-by"

type Props = {}

const OutletHeader = ({}: Props) => {
   return (
      <div className="flex items-end justify-between">
         <div className="flex gap-4 items-end">
            <h1 className="font-bold text-4xl text-start">All Books</h1>
            <p className="text-base text-white brightness-50">9 Books</p>
         </div>
         <SortBy />
      </div>
   )
}

export default OutletHeader