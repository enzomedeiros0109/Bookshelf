import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { getBookById } from "@/api/api";
import { getIndividualGenres } from "@/lib/book-genres";
import {
  getUserBookByExternalId,
  saveBookToLibrary,
  type LibraryBookPatch,
  type ReadingStatus,
} from "@/api/supabase";
import { useAuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLanguage } from "@/hooks/use-get-language";

const statuses: { value: Exclude<ReadingStatus, null>; label: string }[] = [
  { value: "reading", label: "Currently Reading" },
  { value: "want_to_read", label: "Want to Read" },
  { value: "read", label: "Read" },
];

function getMutationErrorDetails(error: unknown) {
  let errorData: unknown = error;

  if (error instanceof Error || typeof error === "string") {
    const message = error instanceof Error ? error.message : error;
    try {
      errorData = JSON.parse(message) as unknown;
    } catch {
      return { message };
    }
  }

  if (typeof errorData === "object" && errorData !== null) {
    const details = errorData as { message?: unknown; hint?: unknown };
    return {
      message:
        typeof details.message === "string"
          ? details.message
          : "Could not save your changes.",
      ...(typeof details.hint === "string" ? { hint: details.hint } : {}),
    };
  }

  return { message: "Could not save your changes." };
}

const BookDetail = () => {
  const { externalId } = useParams();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [pagesRead, setPagesRead] = useState("0");
  const [totalPagesInput, setTotalPagesInput] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    value: ReadingStatus;
  } | null>(null);
  const bookQuery = useQuery({
    queryKey: ["google-book", externalId],
    queryFn: () => getBookById(externalId ?? ""),
    enabled: Boolean(externalId),
  });
  const libraryBookQuery = useQuery({
    queryKey: ["library-book", user?.id, externalId],
    queryFn: () => getUserBookByExternalId(externalId ?? ""),
    enabled: Boolean(user?.id && externalId),
  });
  const mutation = useMutation({
    mutationFn: (patch: LibraryBookPatch) => {
      if (!bookQuery.data) throw new Error("Book details are unavailable");
      return saveBookToLibrary(bookQuery.data, patch);
    },
    onSuccess: async (savedBook) => {
      queryClient.setQueryData(
        ["library-book", user?.id, externalId],
        savedBook
      );
      setPendingStatus(null);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user-library", user?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reading-goal", user?.id],
        }),
      ]);
      setValidationError(null);
    },
    onError: () => setPendingStatus(null),
  });

  useEffect(() => {
    setPagesRead(String(libraryBookQuery.data?.pagesRead ?? 0));
  }, [libraryBookQuery.data?.id, libraryBookQuery.data?.pagesRead]);

  useEffect(() => {
    setTotalPagesInput(
      String(
        libraryBookQuery.data?.totalPages ?? bookQuery.data?.pageCount ?? ""
      )
    );
  }, [
    externalId,
    libraryBookQuery.data?.id,
    libraryBookQuery.data?.totalPages,
    bookQuery.data?.pageCount,
  ]);

  if (bookQuery.isLoading) {
    return <div className="p-8 text-muted-foreground">Loading book...</div>;
  }

  if (bookQuery.error || !bookQuery.data) {
    return (
      <div className="flex min-h-full w-full flex-col gap-4 p-8">
        <Link to="/all-books" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to All Books
        </Link>
        <p className="text-destructive">
          {bookQuery.error instanceof Error
            ? bookQuery.error.message
            : "Book not found."}
        </p>
      </div>
    );
  }

  const book = bookQuery.data;
  const individualGenres = getIndividualGenres(book.genres);
  const savedBook = libraryBookQuery.data;
  const displayedStatus = pendingStatus ? pendingStatus.value : savedBook?.status;
  const displayedPagesRead =
    pendingStatus?.value === "reading" && savedBook?.status !== "reading"
      ? "0"
      : pagesRead;
  const isPending = mutation.isPending || libraryBookQuery.isLoading;
  const totalPagesValue =
    totalPagesInput ??
    String(savedBook?.totalPages ?? book.pageCount ?? "");
  const parsedTotalPages =
    totalPagesValue.trim() === "" ? null : Number(totalPagesValue);
  const totalPages =
    parsedTotalPages !== null &&
      Number.isInteger(parsedTotalPages) &&
      parsedTotalPages > 0
      ? parsedTotalPages
      : null;
  const pagesReadNumber = Number(displayedPagesRead);
  const canSavePagesRead =
    displayedStatus === "reading" &&
    totalPages !== null &&
    Number.isInteger(pagesReadNumber) &&
    pagesReadNumber >= 0 &&
    pagesReadNumber <= totalPages;
  const canSaveTotalPages =
    Boolean(savedBook && totalPages) &&
    savedBook?.totalPages !== totalPages &&
    !isPending;
  const mutationError = mutation.error
    ? getMutationErrorDetails(mutation.error)
    : null;

  const selectStatus = (status: Exclude<ReadingStatus, null>) => {
    const nextStatus = savedBook?.status === status ? null : status;

    if ((nextStatus === "reading" || nextStatus === "read") && !totalPages) {
      setValidationError("Enter the total number of pages before saving this status.");
      return;
    }

    setValidationError(null);
    setPendingStatus({ value: nextStatus });
    mutation.mutate({
      status: nextStatus,
      ...(totalPages ? { totalPages } : {}),
    });
  };

  const toggleFavorite = () => {
    setValidationError(null);
    mutation.mutate({
      isFavorite: !savedBook?.isFavorite,
      ...(totalPages ? { totalPages } : {}),
    });
  };

  const saveTotalPages = () => {
    if (!totalPages) {
      setValidationError("Total pages must be a positive whole number.");
      return;
    }
    setValidationError(null);
    mutation.mutate({ totalPages });
  };

  const savePagesRead = () => {
    if (!canSavePagesRead || totalPages === null) return;
    setValidationError(null);
    mutation.mutate({ pagesRead: pagesReadNumber, totalPages });
  };

  const safeDescription = DOMPurify.sanitize(book.description, {
    USE_PROFILES: { html: true },
  });

  return (
    <div className="book-detail flex min-h-full w-full flex-col gap-6 p-6 md:p-8">
      <Link to="/all-books" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to All Books
      </Link>

      <div className="grid w-full grid-cols-[88px_minmax(0,1fr)] gap-5 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6">
        <div>
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.name}`}
              className="aspect-2/3 w-22 rounded-lg bg-muted object-cover sm:w-28"
            />
          ) : (
            <div className="flex aspect-2/3 w-22 items-center justify-center rounded-lg bg-muted text-center text-xs text-muted-foreground sm:w-28 sm:text-sm">
              No cover
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl">{book.name}</h1>
            <p className="text-muted-foreground">
              {book.authors.join(", ") || "Unknown author"}
            </p>
            <p className="text-sm text-muted-foreground">
              Language: {getLanguage(book.language)}
            </p>

            {individualGenres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {individualGenres.map((genre) => (
                  <span
                    key={genre}
                    className="max-w-50 wrap-break-word rounded-xl bg-accent/20 px-3 py-1 text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

          </div>
          <div className="space-y-3">
            <h2 className="text-xl">Reading status</h2>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status.value}
                  type="button"
                  variant={displayedStatus === status.value ? "default" : "outline"}
                  aria-pressed={displayedStatus === status.value}
                  disabled={isPending}
                  onClick={() => selectStatus(status.value)}
                  className={`cursor-pointer ${displayedStatus === status.value ? "book-detail-action" : ""}`}
                >
                  {status.label}
                </Button>
              ))}
              <Button
                type="button"
                variant={savedBook?.isFavorite ? "default" : "outline"}
                aria-pressed={savedBook?.isFavorite ?? false}
                disabled={isPending}
                onClick={toggleFavorite}
                className={`cursor-pointer ${savedBook?.isFavorite ? "book-detail-action" : ""}`}
              >
                <Star
                  fill={savedBook?.isFavorite ? "currentColor" : "none"}
                  className="size-4"
                />
                {savedBook?.isFavorite ? "Favorited" : "Favorite"}
              </Button>
            </div>
            {(validationError || mutationError) && (
              <div role="alert" className="space-y-1 text-sm text-destructive">
                {validationError && <p>{validationError}</p>}
                {mutationError && <p>{mutationError.message}</p>}
                {mutationError?.hint && <p>Hint: {mutationError.hint}</p>}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {book.pageCount ? (
              displayedStatus === 'reading' && (
                <p className="text-sm text-muted-foreground">
                  Total pages: {totalPages ?? book.pageCount}
                </p>
              )
            ) : (
              <div className="flex max-w-sm items-end gap-2">
                <div className="flex-1 space-y-2">
                  <label htmlFor="total-pages" className="text-sm font-medium">
                    Total pages
                  </label>
                  <Input
                    id="total-pages"
                    type="number"
                    min={1}
                    step={1}
                    value={totalPagesInput ?? totalPagesValue}
                    onChange={(event) => {
                      setTotalPagesInput(event.target.value);
                      setValidationError(null);
                    }}
                    disabled={isPending}
                  />
                </div>
                {canSaveTotalPages && (
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={saveTotalPages}
                    className="book-detail-action cursor-pointer"
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          </div>

          {displayedStatus === "reading" && (
            <div className="space-y-3">
              <label htmlFor="pages-read" className="text-sm font-medium">
                Pages read
              </label>
              <div className="flex max-w-sm items-end gap-2">
                <Input
                  id="pages-read"
                  type="number"
                  min={0}
                  max={totalPages ?? undefined}
                  step={1}
                  value={displayedPagesRead}
                  onChange={(event) => setPagesRead(event.target.value)}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  disabled={isPending || !canSavePagesRead}
                  onClick={savePagesRead}
                  className="book-detail-action cursor-pointer"
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {book.description && (
            <div className="space-y-2">
              <h2 className="text-xl">About this book</h2>
              <div
                className="text-sm leading-6 text-muted-foreground [&_br]:block [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: safeDescription }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
