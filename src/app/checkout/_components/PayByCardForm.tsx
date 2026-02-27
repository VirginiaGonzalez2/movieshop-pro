/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-23 09:30:23
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-25 16:19:00
 *   Description: Card payment form.
 */

"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethodFormValues } from "@/form-schemas/payment";
import { buildInputFilter } from "@/utils/input-event-filters";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
};

const numberInputFilter = buildInputFilter({ numericsOnly: true, maxLength: 16 });
const securityCodeInputFilter = buildInputFilter({ numericsOnly: true, maxLength: 3 });

export function PayByCardForm({ form }: Props) {
    return (
        <>
            <Controller
                control={form.control}
                name="paymentCardInfo.cardName"
                render={({ field, fieldState }) => {
                    // const fieldOnChange = field.onChange;
                    // field.onChange = (e: ChangeEvent<HTMLInputElement>) => {
                    //     numberFormatter(e);
                    //     fieldOnChange(e.currentTarget.value.replaceAll("-", ""));
                    // };
                    return (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Name on Card</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                pattern="\d{4}-\d{4}-\d{4}-\d{4}"
                                onChange={(e) =>
                                    field.onChange(e.currentTarget.value.replaceAll("-", ""))
                                }
                                autoComplete="cc-name"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    );
                }}
            />
            <Controller
                control={form.control}
                name="paymentCardInfo.cardNumber"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>16-digit Card Number</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            autoComplete="cc-number"
                            onBeforeInput={numberInputFilter}
                        />
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
                        <Input
                            {...field}
                            id={field.name}
                            autoComplete="cc-csc"
                            onBeforeInput={securityCodeInputFilter}
                        />
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
