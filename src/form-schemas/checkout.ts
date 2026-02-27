/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-19 14:44:32
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 08:51:12
 * @ Description:
 */

import z from "zod";
import { paymentCardSchema, PaymentMethod, paymentPayPalSchema, PaymentSchemaKey } from "./payment";
import { shippingAddressSchema, shippingMethodSchema } from "./shipping";

const development = process.env.NODE_ENV === "development";

// Checkout Schema (Combines shipping address + method, payment method, and shopping cart)

export const checkoutSchema = z.object({
    ...z.object({
        orderItems: z.array(
            z.object({
                id: z.number(),
                quantity: z.number(),
                cost: z.number(),
            }),
        ),
        orderCost: z.number(),
    }).shape,
    ...shippingAddressSchema.shape,
    ...shippingMethodSchema.shape,
    [PaymentSchemaKey.METHOD]: z.string<PaymentMethod>(),
    [PaymentSchemaKey.CARD]: paymentCardSchema.optional(),
    [PaymentSchemaKey.PAYPAL]: paymentPayPalSchema.optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type FullPaymentMethodFormValues = Pick<
    CheckoutFormValues,
    PaymentSchemaKey.METHOD | PaymentSchemaKey.CARD | PaymentSchemaKey.PAYPAL
>;

export type OrderItemsFormValues = Pick<CheckoutFormValues, "orderItems" | "orderCost">;
