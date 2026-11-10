import { z } from "zod";

export const bookSchema = z.object({
  externalId: z.string(),
  name: z.string(),
  authors: z.array(z.string()),
  language: z.string().nullable(),
  genres: z.array(z.string()),
  mainCategory: z.string().nullable(),
  cover: z.string().nullable(),
  description: z.string(),
  pageCount: z.number().int().positive().nullable(),
});

export type BookSchema = z.infer<typeof bookSchema>;
