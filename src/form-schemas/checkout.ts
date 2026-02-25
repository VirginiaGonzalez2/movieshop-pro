import z from "zod";
import isoCountryCodes from "@/static/iso-country-codes.json";

const development = process.env.NODE_ENV === "development";

// Customer Information

const errFirstNameMissing = "Please enter your full name.";
const errLastNameMissing = "Please enter your full name.";
const errStreetAddressMissing = "Please enter your street address.";
const errPostalCodeMissing = "Please enter your 5-digit postal code.";
const errPostalCodeInvalid = "Please enter your 5-digit postal code.";
const errCityMissing = "Please enter your city.";
const errCountryMissing = "Please select a country.";

const shippingCountryLookup: ReadonlyMap<string, string> = new Map(
    isoCountryCodes.map((value) => [value.alpha3, value.country]),
);
export const shippingCountries: [string, string][] = shippingCountryLookup.entries().toArray();

export const shippingAddressSchema = z
    .object({
        firstName: z.string(errFirstNameMissing).min(1, errFirstNameMissing),
        lastName: z.string(errLastNameMissing).min(1, errLastNameMissing),
        streetAddress: z.string(errStreetAddressMissing).min(1, errStreetAddressMissing),
        postalCode: z
            .string(errPostalCodeMissing)
            .min(5, errPostalCodeInvalid)
            .max(5, errPostalCodeInvalid),
        city: z.string(errCityMissing).min(1, errCityMissing),
        country: z.string(errCountryMissing),
    })
    .refine(
        (values) => {
            console.log(values.country);
            return shippingCountryLookup.has(values.country);
        },
        {
            error: errCountryMissing,
            path: ["country"],
        },
    );

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

// Shipping

// TODO: Validation of available shipping methods.

const errShippingMethodMissing = "Please select a shipping method.";

export const shippingMethodSchema = z.object({
    shippingMethod: z.string(errShippingMethodMissing),
});

export type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>;

// Payment

// TODO: Validation of available payment methods.

export type PaymentMethod = "card" | "paypal";

// Card

const errCardNameMissing = "Please enter the name found on your card.";
const errCardNumberMissing = "Please enter your card number.";
const errCardNumberInvalid =
    "This is not a valid card number." +
    (development ? " [DEV: 16 numbers, start with 0 to decline the card on processing]" : "");
const errCardSecurityCodeInvalid =
    "Please enter the 3-digit security code found on the back of your card.";

const paymentCardSchema = z.object({
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

const paymentPayPalSchema = z.object({
    payPalEmail: z.email(errPayPalEmail),
});

export type PaymentPayPalFormValues = z.infer<typeof paymentPayPalSchema>;

// Combined Payment

const errPaymentMethodMissing = "Please select a payment method.";

export const paymentMethodSchema = z.discriminatedUnion("paymentMethod", [
    z.object({
        paymentMethod: z.literal("card" as PaymentMethod, errPaymentMethodMissing),
        paymentCardInfo: paymentCardSchema,
    }),
    z.object({
        paymentMethod: z.literal("paypal" as PaymentMethod, errPaymentMethodMissing),
        paymentPayPalInfo: paymentPayPalSchema,
    }),
]);

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export type FullPaymentMethodFormValues = Pick<PaymentMethodFormValues, "paymentMethod"> & {
    paymentCardInfo?: PaymentCardFormValues;
    paymentPayPalInfo?: PaymentPayPalFormValues;
};
