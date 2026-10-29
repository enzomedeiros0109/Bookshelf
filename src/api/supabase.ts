import { supabase } from "@/lib/supabase-client";


export interface Book {
  externalId: string;
  name: string;
  authors: string[];
  genres: string[];
  cover: string | null;
  description: string;
}

export async function addBookToAccount(book: Book) {
  // Get the currently authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User is not logged in");

  // Insert the book if it does not already exist
  const { error: bookError } = await supabase
    .from("books")
    .upsert(
      {
        provider: "google_books",
        provider_book_id: book.externalId,
        title: book.name,
        authors: book.authors,
        genres: book.genres,
        cover_url: book.cover,
        description: book.description,
      },
      {
        onConflict: "provider,provider_book_id",
        ignoreDuplicates: true,
      }
    );

  if (bookError) throw bookError;

  // Retrieve the book's internal database ID
  const { data: savedBook, error: findError } = await supabase
    .from("books")
    .select("id")
    .eq("provider", "google_books")
    .eq("provider_book_id", book.externalId)
    .single();

  if (findError) throw findError;

  // Associate the book with the logged-in user
  const { error: linkError } = await supabase
    .from("user_books")
    .upsert(
      {
        user_id: user.id,
        book_id: savedBook.id,
        status: "to_read",
        is_favorite: false,
      },
      {
        onConflict: "user_id,book_id",
      }
    );

  if (linkError) throw linkError;

  return savedBook.id;
}