import { z } from "zod";

export const personSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional().or(z.literal("")),
});
