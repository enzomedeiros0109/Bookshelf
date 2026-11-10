import { bookSchema } from '@/schemas/db/books-schema';
import type { BookLanguage } from '@/constants/book-languages';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const apiBase = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1/',
  params: {
    key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
  },
});

const api = rateLimit(apiBase, {
  maxRequests: 1,
  perMilliseconds: 1000,
});

function parseVolume(item: any) {
  const info = item.volumeInfo;

  if (!info?.title) return null;

  return bookSchema.parse({
    externalId: item.id,
    name: info.title,
    authors: info.authors ?? [],
    language: info.language ?? null,
    genres: info.categories ?? [],
    mainCategory: info.mainCategory ?? null,
    cover: info.imageLinks?.thumbnail ?? null,
    description: info.description ?? '',
    pageCount:
      Number.isInteger(info.pageCount) && info.pageCount > 0
        ? info.pageCount
        : null,
  });
}

function logGoogleBooksError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('Google Books API error:', error.response?.data);
    console.error('HTTP status:', error.response?.status);
  }
}

export async function getBooks(query: string, language: BookLanguage = 'en') {
  try {
    const { data } = await api.get('/volumes', {
      params: {
        q: `intitle:${query}`,
        langRestrict: language,
        printType: 'books',
        orderBy: 'relevance',
        maxResults: 20,
      },
    });

    return (data.items ?? []).flatMap((item: any) => {
      const book = parseVolume(item);
      if (!book) return [];

      const bookLanguage = book.language?.toLowerCase().split(/[-_]/)[0];
      return bookLanguage === language ? [book] : [];
    });
  } catch (error) {
    logGoogleBooksError(error);
    throw error;
  }
}

export async function getBookById(externalId: string) {
  try {
    const { data } = await api.get(`/volumes/${encodeURIComponent(externalId)}`);
    const book = parseVolume(data);

    if (!book) throw new Error("Book not found");

    return book;
  } catch (error) {
    logGoogleBooksError(error);
    throw error;
  }
}
