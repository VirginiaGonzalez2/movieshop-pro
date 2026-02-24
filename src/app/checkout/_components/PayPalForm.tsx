/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-23 10:47:06
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-23 16:33:00
 *   Description: PayPal form.
 */

"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethodFormValues } from "@/form-schemas/checkout";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
};

export function PayPalForm({ form }: Props) {
    return (
        <Controller
            control={form.control}
            name="paymentPayPalInfo.payPalEmail"
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={field.name}>PayPal E-mail</FieldLabel>
                    <Input {...field} id={field.name} autoComplete="email" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
