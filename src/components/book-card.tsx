import { useState } from "react";
import { Card } from "./ui/card"
import BookImage from '@/assets/mockup/book.jpeg'
import { Bookmark, Star } from "lucide-react";

type Props = {
}

const genresMockup = [
  "Hard Science Fiction",
  "Space Adventure / Survival",
  "First Contact",
]

const BookCard = ({ }: Props) => {

  const [isBookmarkChecked, setIsBookmarkChecked] = useState(false)
  const [isFavoriteChecked, setIsFavoriteChecked] = useState(false)
  const isRead = true

  const handleBookmark = () => {
    setIsBookmarkChecked(current => !current);
  }

  const handleFavorite = () => {
    setIsFavoriteChecked(current => !current);
  }

  const progressBarValue = 50

  return (
    <Card className="grid grid-cols-2 w-full shadow-lg transform transition-all hover:scale-105 duration-300">
      <div className="px-4">
        <img
          src={BookImage}
          alt="Book Cover"
          className="w-full rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2 pr-5">
        <h1 className="text-lg">Project Hail Mary</h1>
        <h2 className="text-white brightness-50">Andy Weir</h2>
        {genresMockup.map((genre) => (
          <>
            <div className="bg-accent/30 rounded-xl">
              <p className="text-center">{genre}</p>
            </div>
          </>
        ))}

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span>Progress</span>
            <span>{progressBarValue}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressBarValue}
            className="h-2 w-full overflow-hidden rounded-full bg-accent/20"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${progressBarValue}%` }}
            />
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={handleBookmark}
                aria-pressed={isBookmarkChecked}
                className="cursor-pointer"
              >
                <Bookmark
                  fill={isBookmarkChecked ? "gold" : "none"}
                  className="size-5"
                />
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={isFavoriteChecked}
                className="cursor-pointer"
              >
                <Star
                  fill={isFavoriteChecked ? "gold" : "none"}
                  className="size-5"
                />
              </button>
            </div>
            <div className="bg-accent p-2 rounded-lg text-center">
              <p className="font-semibold">{isRead ? "Read" : "Pending"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BookCard