import { z } from "zod";

export const discountTypeValues = ["PERCENTAGE", "FIXED_AMOUNT"] as const;
export const discountScopeValues = ["ALL_PRODUCTS", "SELECTED_PRODUCTS"] as const;

const optionalDateTimeLocal = z
    .string()
    .optional()
    .transform((value) => {
        const trimmed = value?.trim() ?? "";
        return trimmed.length > 0 ? trimmed : undefined;
    });

export const discountCodeSchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(3, "Code must be at least 3 characters.")
            .max(40, "Code must be 40 characters or fewer.")
            .regex(/^[A-Za-z0-9_-]+$/, "Code can only use letters, numbers, dash, and underscore."),
        type: z.enum(discountTypeValues),
        value: z.coerce.number().positive("Discount value must be greater than 0."),
        scope: z.enum(discountScopeValues),
        startsAt: optionalDateTimeLocal,
        endsAt: optionalDateTimeLocal,
        usageLimit: z
            .string()
            .optional()
            .transform((value) => {
                const trimmed = value?.trim() ?? "";
                return trimmed.length > 0 ? trimmed : undefined;
            }),
    })
    .superRefine((data, ctx) => {
        if (data.type === "PERCENTAGE" && data.value > 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["value"],
                message: "Percentage discount cannot exceed 100.",
            });
        }

        const startDate = data.startsAt ? new Date(data.startsAt) : undefined;
        const endDate = data.endsAt ? new Date(data.endsAt) : undefined;

        if (startDate && Number.isNaN(startDate.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["startsAt"],
                message: "Start date is invalid.",
            });
        }

        if (endDate && Number.isNaN(endDate.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endsAt"],
                message: "End date is invalid.",
            });
        }

        if (startDate && endDate && endDate < startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endsAt"],
                message: "End date must be after start date.",
            });
        }

        if (data.usageLimit !== undefined) {
            const numeric = Number(data.usageLimit);
            if (!Number.isInteger(numeric) || numeric <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["usageLimit"],
                    message: "Usage limit must be a positive whole number.",
                });
            }
        }
    });
