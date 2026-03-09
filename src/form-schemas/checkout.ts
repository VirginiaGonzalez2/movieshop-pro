/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-19 14:44:32
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 08:51:12
 * @ Description: Checkout schema (Combines shipping address + method, payment method, and shopping cart)
 */

import z from "zod";
import { paymentCardSchema, PaymentMethod, paymentPayPalSchema, PaymentSchemaKey } from "./payment";
import { shippingAddressSchema, shippingMethodSchema } from "./shipping";

const orderItem = z.object({
    id: z.union([z.number(), z.string()]),
    quantity: z.number().optional(),
});

export const checkoutSchema = z.object({
    orderItems: z.array(orderItem),
    buyNow: z.boolean().optional(),
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

export type OrderItemFormValues = z.infer<typeof orderItem>;
