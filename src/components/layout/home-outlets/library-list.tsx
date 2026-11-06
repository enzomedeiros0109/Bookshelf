import { useQuery } from "@tanstack/react-query";
import { getUserLibrary, type LibraryFilter } from "@/api/supabase";
import { useAuthContext } from "@/context/auth-context";
import BookCard from "@/components/book-card";
import OutletHeader from "./outlet-header";

type Props = {
  title: string;
  filter?: LibraryFilter;
};

const LibraryList = ({ title, filter = {} }: Props) => {
  const { user } = useAuthContext();
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "user-library",
      user?.id,
      filter.status ?? "all",
      filter.favoritesOnly ?? false,
    ],
    queryFn: () => getUserLibrary(filter),
    enabled: Boolean(user?.id),
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <OutletHeader title={title} count={data?.length ?? 0} isLoading={isLoading} />

      {isLoading ? (
        <p className="text-muted-foreground">Loading books...</p>
      ) : error ? (
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Could not load books."}
        </p>
      ) : data?.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <p className="text-muted-foreground">No books in this section yet.</p>
      )}
    </div>
  );
};

export default LibraryList;
