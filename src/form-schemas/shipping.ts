/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-25 08:56:58
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 08:58:54
 * @ Description: Shipping address and method form schemas.
 */

import z from "zod";
import isoCountryCodes from "@/static/iso-country-codes.json";

// Shipping Address

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
    .refine((values) => shippingCountryLookup.has(values.country), {
        error: errCountryMissing,
        path: ["country"],
    });

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;

// Shipping Methods

// TODO: Validation of available shipping methods.

const errShippingMethodMissing = "Please select a shipping method.";

export const shippingMethodSchema = z.object({
    shippingMethod: z.string(errShippingMethodMissing),
});

export type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>;
