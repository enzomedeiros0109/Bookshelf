import BookCard from "../book-card"

type Props = {}

const AllBooks = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="font-bold text-4xl text-start">All books</h1>
      <div className="grid grid-cols-3 gap-8">

      {Array.from({length: 9}).map( (_, index) => (
        <BookCard />
      ))}
      </div>
    </div>
  )
}

export default AllBooks
