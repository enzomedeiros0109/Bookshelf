import z from "zod";

export const passwordSchema = z.object({
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


export type PasswordSchema = z.infer<typeof passwordSchema>