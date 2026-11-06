import { z } from "zod";

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, { error: "Display name is required." })
    .max(120, { error: "Display name must be 120 characters or fewer." }),
});

export type DisplayNameFields = z.infer<typeof displayNameSchema>;
