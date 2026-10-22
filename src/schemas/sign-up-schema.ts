import { z } from 'zod'

export const signUpSchema = z.object({
   fullName: z.string().max(120, { error: "Name is too long. Maximum 120 characters." }),
   email: z.email({ error: "Invalid email" }),
   password: z.string()
      .min(8, { error: "Your password must be at least 8 characters long" })
      .regex(/[^A-Za-z0-9]/, {
         error: "Password must include at least one special character.",
      }),
   confirmPassword: z.string().min(1, { error: "Confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
   error: "Passwords do not match",
   path: ["confirmPassword"],
})

export type SignUpSchema = z.infer<typeof signUpSchema>