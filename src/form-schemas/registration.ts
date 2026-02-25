/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-??
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 08:51:22
 * @ Description: Password validation.
 */

import z from "zod";

const errUsernameLengthMin = "Username must be atleast 2 characters.";
const errUsernameLengthMax = "Please pick a username shorter than 128 characters.";
const errPasswordLengthMin = "Password must be atleast 8 characters long.";
const errPasswordLengthMax = "Please make your password shorter than 128 characters.";

export const registrationFormSchema = z
    .object({
        name: z.string().min(2, errUsernameLengthMin).max(128, errUsernameLengthMax),
        email: z.email(),
        password: z.string().min(8, errPasswordLengthMin).max(128, errPasswordLengthMax),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
