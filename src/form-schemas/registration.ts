import z from "zod";

const errUsernameLength = "Username must be between 2-20 characters long.";
const errPasswordLength = "Password must be between 8-20 characters long.";

export const registrationFormSchema = z
    .object({
        name: z.string().min(2, errUsernameLength).max(20, errPasswordLength),
        email: z.email(),
        password: z.string().min(8, errPasswordLength).max(128, errPasswordLength),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
