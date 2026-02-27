/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-25 08:57:19
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 08:58:17
 * @ Description:
 */

import z from "zod";
import { shippingAddressSchema, shippingMethodSchema } from "./shipping";

const development = process.env.NODE_ENV === "development";

// TODO: Validation of available payment methods.

export type PaymentMethod = "card" | "paypal";

// Card

const errCardNameMissing = "Please enter the name found on your card.";
const errCardNumberMissing = "Please enter your card number.";
const errCardNumberInvalid =
    "This is not a valid card number." +
    (development ? " [DEV: Start with 0 to decline the card on processing]" : "");
const errCardSecurityCodeInvalid =
    "Please enter the 3-digit security code found on the back of your card.";

export const paymentCardSchema = z.object({
    cardName: z.string(errCardNameMissing),
    cardNumber: z
        .string(errCardNumberMissing)
        .min(16, errCardNumberInvalid)
        .max(16, errCardNumberInvalid),
    cardSecurityCode: z
        .string(errCardSecurityCodeInvalid)
        .min(3, errCardSecurityCodeInvalid)
        .max(3, errCardSecurityCodeInvalid),
    cardExpirationDate: z.string(),
});

export type PaymentCardFormValues = z.infer<typeof paymentCardSchema>;

// PayPal

const errPayPalEmail = "Please enter the e-mail linked to your PayPal account.";

export const paymentPayPalSchema = z.object({
    payPalEmail: z.email(errPayPalEmail),
});

export type PaymentPayPalFormValues = z.infer<typeof paymentPayPalSchema>;

// Combined Payment

// For my sanity /Sabrina
export enum PaymentSchemaKey {
    METHOD = "paymentMethod",
    CARD = "paymentCardInfo",
    PAYPAL = "paymentPayPalInfo",
}

const errPaymentMethodMissing = "Please select a payment method.";

export const paymentMethodSchema = z.discriminatedUnion(PaymentSchemaKey.METHOD, [
    z.object({
        [PaymentSchemaKey.METHOD]: z.literal("card" as PaymentMethod, errPaymentMethodMissing),
        [PaymentSchemaKey.CARD]: paymentCardSchema,
    }),
    z.object({
        [PaymentSchemaKey.METHOD]: z.literal("paypal" as PaymentMethod, errPaymentMethodMissing),
        [PaymentSchemaKey.PAYPAL]: paymentPayPalSchema,
    }),
]);

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
