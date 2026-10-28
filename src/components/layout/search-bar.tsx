import { Search } from "lucide-react"
import { cn } from "cn"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { useQuery } from "@tanstack/react-query"
import { getBooks } from "@/api/api"
import { useEffect, useState } from "react"
import type { BookSchema } from "@/schemas/db/books-schema"

type Props = { className?: string }

const SearchBar = ({ className }: Props) => {

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Aguarda o usuário parar de digitar por 300 ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["getBooks", debouncedQuery],
    queryFn: () => getBooks(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
    retry: false,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="relative w-full">
      <InputGroup className={cn("rounded-md", className)}>
        <InputGroupInput
          placeholder="Search books..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {query.trim().length >= 3 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-md border bg-background shadow-lg">
          {isFetching && (
            <p className="p-3 text-sm text-muted-foreground">
              Searching books...
            </p>
          )}

          {error && (
            <p className="p-3 text-sm text-destructive">
              Book not available.
            </p>
          )}

          {!isFetching && !error && data?.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">
              No books found.
            </p>
          )}

          {!isFetching &&
            data?.map((book: BookSchema) => (
              <div
                key={book.externalId}
                className="flex gap-3 border-b p-3 last:border-b-0 hover:bg-muted"
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.name}`}
                    className="h-30 w-20 shrink-0 rounded object-fill self-center"
                  />
                ) : (
                  <div className="flex h-30 w-20 shrink-0 items-center justify-center rounded bg-muted text-xs">
                    No cover
                  </div>
                )}

                <div className="max-w-40">
                  <p className="font-sm">{book.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {book.authors.join(", ") || "Unknown author"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {book.genres.join(", ") || "No categories"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar
