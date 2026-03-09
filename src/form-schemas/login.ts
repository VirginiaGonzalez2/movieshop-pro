import z from "zod";

const errEmail = "Please enter a valid e-mail.";
const errPassword = "Please enter your password.";

export const loginFormSchema = z.object({
    email: z.email(errEmail),
    password: z.string(errPassword).min(1, errPassword),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
