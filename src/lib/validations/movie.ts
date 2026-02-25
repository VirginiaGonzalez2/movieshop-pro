import { z } from "zod";

export const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description is too short"),
    price: z.coerce.number().positive("Price must be positive"),
    releaseDate: z.coerce.date(),
    runtime: z.coerce.number().int().min(1, "Runtime must be at least 1 minute"),

    imageUrl: z.string().optional().or(z.literal("")),
    trailerUrl: z.string().optional().or(z.literal("")),

    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});
