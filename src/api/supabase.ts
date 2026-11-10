import { supabase } from "@/lib/supabase-client";
import { getMostFrequentGenre } from "@/lib/book-genres";
import type { BookSchema } from "@/schemas/book";

export type ReadingStatus = "want_to_read" | "reading" | "read" | null;

export type LibraryBook = BookSchema & {
  id: string;
  status: ReadingStatus;
  isFavorite: boolean;
  pagesRead: number;
  totalPages: number | null;
};

export type LibraryFilter = {
  status?: Exclude<ReadingStatus, null>;
  favoritesOnly?: boolean;
};

export type LibraryBookPatch = {
  status?: ReadingStatus;
  isFavorite?: boolean;
  pagesRead?: number;
  totalPages?: number;
};

export type ReadingGoalSummary = {
  booksRead: number;
  goalBooks: number;
  year: number;
};

export type ReadingStatsBook = {
  completedAt: string | null;
  mainCategory: string | null;
};

type CatalogRow = {
  id: string;
  provider_book_id: string;
  title: string;
  authors: string[] | null;
  genres: string[] | null;
  main_category: string | null;
  cover_url: string | null;
  description: string | null;
};

type UserBookRow = {
  book_id: string;
  status: ReadingStatus;
  is_favorite: boolean;
  pages_read: number;
  total_pages: number | null;
  books: CatalogRow | null;
};

async function getAuthenticatedUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("User is not logged in");

  return user.id;
}

function toLibraryBook(row: UserBookRow): LibraryBook | null {
  if (!row.books) return null;

  return {
    id: row.book_id,
    externalId: row.books.provider_book_id,
    name: row.books.title,
    authors: row.books.authors ?? [],
    language: null,
    genres: row.books.genres ?? [],
    mainCategory: row.books.main_category,
    cover: row.books.cover_url,
    description: row.books.description ?? "",
    pageCount: row.total_pages,
    status: row.status,
    isFavorite: row.is_favorite,
    pagesRead: row.pages_read ?? 0,
    totalPages: row.total_pages,
  };
}

async function getCatalogBookId(book: BookSchema) {
  const { error: upsertError } = await supabase
    .from("books")
    .upsert(
      {
        provider: "google_books",
        provider_book_id: book.externalId,
        title: book.name,
        authors: book.authors,
        genres: book.genres,
        main_category: book.mainCategory,
        cover_url: book.cover,
        description: book.description,
      },
      {
        onConflict: "provider,provider_book_id",
        ignoreDuplicates: true,
      }
    );

  if (upsertError) throw upsertError;

  const { data, error } = await supabase
    .from("books")
    .select("id")
    .eq("provider", "google_books")
    .eq("provider_book_id", book.externalId)
    .single();

  if (error) throw error;

  return data.id as string;
}

export async function getUserLibrary(filter: LibraryFilter = {}) {
  const userId = await getAuthenticatedUserId();
  let query = supabase
    .from("user_books")
    .select(
      "book_id,status,is_favorite,pages_read,total_pages,books!inner(id,provider_book_id,title,authors,genres,main_category,cover_url,description)"
    )
    .eq("user_id", userId)
    .eq("books.provider", "google_books");

  if (filter.status) query = query.eq("status", filter.status);
  if (filter.favoritesOnly) query = query.eq("is_favorite", true);

  const { data, error } = await query;

  if (error) throw error;

  return ((data ?? []) as unknown as UserBookRow[])
    .map(toLibraryBook)
    .filter((book): book is LibraryBook => book !== null);
}

export async function getUserBookByExternalId(externalId: string) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("user_books")
    .select(
      "book_id,status,is_favorite,pages_read,total_pages,books!inner(id,provider_book_id,title,authors,genres,main_category,cover_url,description)"
    )
    .eq("user_id", userId)
    .eq("books.provider", "google_books")
    .eq("books.provider_book_id", externalId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toLibraryBook(data as unknown as UserBookRow);
}

export async function saveBookToLibrary(
  book: BookSchema,
  patch: LibraryBookPatch
) {
  const userId = await getAuthenticatedUserId();
  const bookId = await getCatalogBookId(book);
  const { data: currentData, error: currentError } = await supabase
    .from("user_books")
    .select("status,is_favorite,pages_read,total_pages,completed_at")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (currentError) throw currentError;

  const current = currentData as {
    status: ReadingStatus;
    is_favorite: boolean;
    pages_read: number;
    total_pages: number | null;
    completed_at: string | null;
  } | null;
  let status = current?.status ?? null;
  let pagesRead = current?.pages_read ?? 0;
  const totalPages = patch.totalPages ?? current?.total_pages ?? book.pageCount;
  const isFavorite = patch.isFavorite ?? current?.is_favorite ?? false;

  if (Object.hasOwn(patch, "status")) {
    status = patch.status ?? null;

    if (status === "read") {
      if (!totalPages) {
        throw new Error("Enter the total number of pages before marking this book as read");
      }
      pagesRead = totalPages;
    } else if (
      status === "want_to_read" ||
      status === null ||
      current?.status !== "reading"
    ) {
      pagesRead = 0;
    }
  }

  if (patch.totalPages !== undefined && (!Number.isInteger(patch.totalPages) || patch.totalPages <= 0)) {
    throw new Error("Total pages must be a positive integer");
  }

  if (patch.pagesRead !== undefined) {
    if (!Number.isInteger(patch.pagesRead) || patch.pagesRead < 0) {
      throw new Error("Pages read must be a non-negative integer");
    }
    if (status !== "reading") {
      throw new Error("Pages read can only be updated while currently reading");
    }
    if (!totalPages) {
      throw new Error("Enter the total number of pages before updating reading progress");
    }
    if (patch.pagesRead > totalPages) {
      throw new Error("Pages read cannot exceed the total number of pages");
    }
    pagesRead = patch.pagesRead;

    if (pagesRead === totalPages) {
      status = "read";
    }
  }

  if (status === "reading" && !totalPages) {
    throw new Error("Enter the total number of pages before marking this book as currently reading");
  }

  if (status === "read" && totalPages !== null && totalPages !== undefined) {
    pagesRead = totalPages;
  }

  if (totalPages !== null && totalPages !== undefined && pagesRead > totalPages) {
    throw new Error("Pages read cannot exceed the total number of pages");
  }

  const completedAt =
    status === "read"
      ? current?.status === "read"
        ? current.completed_at
        : new Date().toISOString()
      : null;

  if (status === null && !isFavorite) {
    if (current) {
      const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("user_id", userId)
        .eq("book_id", bookId);

      if (error) throw error;
    }

    return null;
  }

  const { error } = await supabase
    .from("user_books")
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
        status,
        is_favorite: isFavorite,
        pages_read: pagesRead,
        total_pages: totalPages,
        completed_at: completedAt,
      },
      { onConflict: "user_id,book_id" }
    );

  if (error) throw error;

  return {
    id: bookId,
    ...book,
    pageCount: totalPages,
    status,
    isFavorite,
    pagesRead,
    totalPages,
  } satisfies LibraryBook;
}

export async function getReadingGoalSummary(year: number): Promise<ReadingGoalSummary> {
  if (!Number.isInteger(year)) throw new Error("Reading goal year must be an integer");

  const userId = await getAuthenticatedUserId();
  const startOfYear = new Date(year, 0, 1).toISOString();
  const startOfNextYear = new Date(year + 1, 0, 1).toISOString();
  const [goalResult, booksResult] = await Promise.all([
    supabase
      .from("user_reading_goals")
      .select("goal_books")
      .eq("user_id", userId)
      .eq("goal_year", year)
      .maybeSingle(),
    supabase
      .from("user_books")
      .select("book_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "read")
      .gte("completed_at", startOfYear)
      .lt("completed_at", startOfNextYear),
  ]);

  if (goalResult.error) throw goalResult.error;
  if (booksResult.error) throw booksResult.error;

  return {
    booksRead: booksResult.count ?? 0,
    goalBooks: goalResult.data?.goal_books ?? 0,
    year,
  };
}

export async function getReadingStatsBooks(): Promise<ReadingStatsBook[]> {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("user_books")
    .select("completed_at,books!inner(main_category,genres)")
    .eq("user_id", userId)
    .eq("status", "read");

  if (error) throw error;

  return ((data ?? []) as unknown as {
    completed_at: string | null;
    books: { main_category: string | null; genres: string[] | null };
  }[]).map((row) => ({
    completedAt: row.completed_at,
    mainCategory: row.books.main_category ?? getMostFrequentGenre(row.books.genres),
  }));
}

export async function saveReadingGoal(year: number, goalBooks: number) {
  if (!Number.isInteger(year)) throw new Error("Reading goal year must be an integer");
  if (!Number.isInteger(goalBooks) || goalBooks < 0) {
    throw new Error("Reading goal must be a non-negative whole number");
  }

  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from("user_reading_goals")
    .upsert(
      { user_id: userId, goal_year: year, goal_books: goalBooks },
      { onConflict: "user_id,goal_year" }
    )
    .select("goal_books")
    .single();

  if (error) throw error;

  return data.goal_books as number;
}
