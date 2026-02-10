import { z } from "zod";

export const genreSchema = z.object({
    name: z.string().min(1, "Genre name is required"),
    description: z.string().optional().or(z.literal("")),
});
