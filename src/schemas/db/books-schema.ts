import { z } from "zod";

export const bookSchema = z.object({
  externalId: z.string(),
  name: z.string(),
  authors: z.array(z.string()),
  genres: z.array(z.string()),
  cover: z.string().nullable(),
});

export type BookSchema = z.infer<typeof bookSchema>;