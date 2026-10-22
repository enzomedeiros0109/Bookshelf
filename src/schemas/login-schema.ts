import { z } from 'zod'

export const loginSchema = z.object({
   email: z.email({ error: "Invalid email" }),
   password: z.string()
      .min(8, { error: "Your password must be at least 8 characters long" })
      .regex(/[^A-Za-z0-9]/, {
         error: "Password must include at least one special character.",
      }),
})

export type LoginSchema = z.infer<typeof loginSchema>