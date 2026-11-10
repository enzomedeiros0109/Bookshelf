import { Star } from "lucide-react";
import { Link, useLocation } from "react-router";
import type { LibraryBook } from "@/api/supabase";
import { Card } from "@/components/ui/card";
import { getIndividualGenres } from "@/lib/book-genres";

type Props = {
  book: LibraryBook;
};

const statusLabels = {
  want_to_read: "Want to Read",
  reading: "Currently Reading",
  read: "Read",
};

const BookCard = ({ book }: Props) => {
  const progressPercent = book.totalPages
    ? Math.min(100, Math.round((book.pagesRead / book.totalPages) * 100))
    : 0;
  const statusLabel = book.status
    ? statusLabels[book.status]
    : book.isFavorite
      ? "Favorite"
      : "In Library";

  const { pathname } = useLocation()

  return (
    <Link to={`/books/${encodeURIComponent(book.externalId)}`} className="block h-full">
      <Card className="h-full shadow-lg transition-transform duration-300 hover:scale-[1.02]">
        <div className="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 p-4">
          <div className="flex items-start">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`Cover of ${book.name}`}
                className="aspect-2/3 w-full rounded-md bg-muted object-cover shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-2/3 w-full items-center justify-center rounded-md bg-muted px-2 text-center text-sm text-muted-foreground">
                No cover
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="line-clamp-2 text-lg">{book.name}</h2>
              {book.isFavorite && (
                <Star aria-label="Favorite" fill="currentColor" className="size-5 shrink-0 text-amber-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {book.authors.join(", ") || "Unknown author"}
            </p>
            <div className="flex flex-col gap-2">
              {getIndividualGenres(book.genres).slice(0, 3).map((genre) => (
                <span key={genre} className="w-fit rounded-xl bg-accent/20 px-2 py-0.5 text-sm">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-auto space-y-2">
              {pathname === "/all-books" && (
                <p className="rounded-lg bg-accent/20 px-2 py-1 text-center text-sm font-medium">
                  {statusLabel}
                </p>
              )}
              {book.status === "reading" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${book.name} reading progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercent}
                    className="h-2 w-full overflow-hidden rounded-full bg-accent/20"
                  >
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BookCard;
