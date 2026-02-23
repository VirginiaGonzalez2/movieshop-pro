/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-23 09:30:23
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-23 16:33:29
 *   Description: Card payment form.
 */

"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethodFormValues } from "@/form-schemas/checkout";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
};

export function PayByCardForm({ form }: Props) {
    return (
        <>
            <Controller
                control={form.control}
                name="paymentCardInfo.cardName"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>Name on Card</FieldLabel>
                        <Input {...field} id={field.name} autoComplete="cc-name" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                control={form.control}
                name="paymentCardInfo.cardNumber"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>16-digit Card Number</FieldLabel>
                        <Input {...field} id={field.name} autoComplete="cc-number" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                control={form.control}
                name="paymentCardInfo.cardSecurityCode"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>3-digit Security Code</FieldLabel>
                        <Input {...field} id={field.name} autoComplete="cc-csc" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                control={form.control}
                name="paymentCardInfo.cardExpirationDate"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>Card Expiration Date (MM/YYYY)</FieldLabel>
                        <Input {...field} id={field.name} autoComplete="cc-exp" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
        </>
    );
}
