import { bookSchema } from '@/schemas/db/books-schema';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';

const apiBase = axios.create({
  baseURL: "https://www.googleapis.com/books/v1/",
  params: {
    key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
  },
});

const api = rateLimit(apiBase, {
  maxRequests: 1,
  perMilliseconds: 1000
})

export async function getBooks(query: string) {
  try {
    const { data } = await api.get("/volumes", {
      params: {
        q: query,
        maxResults: 20,
      },
    });

    return (data.items ?? []).flatMap((item: any) => {
      const info = item.volumeInfo;

      if (!info?.title) return [];

      return [
        bookSchema.parse({
          externalId: item.id,
          name: info.title,
          authors: info.authors ?? [],
          genres: info.categories ?? [],
          cover: info.imageLinks?.thumbnail ?? null,
        }),
      ];
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro da Google Books API:", error.response?.data);
      console.error("Status HTTP:", error.response?.status);
    }

    throw error;
  }
}



