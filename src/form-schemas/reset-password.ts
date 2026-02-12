import z from "zod";

export const resetPasswordFormSchema = z.object({
    email: z.email(),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
