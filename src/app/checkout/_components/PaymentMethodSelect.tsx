/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 16:57:39
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-23 16:32:52
 *   Description: Payment method selection.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FullPaymentMethodFormValues,
    PaymentMethod,
    PaymentMethodFormValues,
    paymentMethodSchema,
} from "@/form-schemas/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PayByCardForm } from "./PayByCardForm";
import { PayPalForm } from "./PayPalForm";

type Props = {
    active: boolean;
    nextStep: string;
    savedValues: FullPaymentMethodFormValues | null;
    onSubmit: (values: PaymentMethodFormValues) => void;
};

export function PaymentMethodSelect(props: Props) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(
        props.savedValues?.paymentMethod,
    );

    const savedValues = props.savedValues as FullPaymentMethodFormValues;

    const form = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            paymentMethod: paymentMethod,
            paymentCardInfo: {
                cardName: savedValues?.paymentCardInfo?.cardName ?? "",
                cardNumber: savedValues?.paymentCardInfo?.cardNumber ?? "",
                cardSecurityCode: savedValues?.paymentCardInfo?.cardSecurityCode ?? "",
                cardExpirationDate: savedValues?.paymentCardInfo?.cardExpirationDate ?? "",
            },
            paymentPayPalInfo: {
                payPalEmail: savedValues?.paymentPayPalInfo?.payPalEmail ?? "",
            },
        },
    });

    const Form = props.active ? "form" : "div";

    return (
        <Form
            id="paymentMethod"
            onSubmit={props.active ? form.handleSubmit(props.onSubmit) : undefined}
        >
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="paymentMethod"
                    render={({ field, fieldState }) => (
                        <Field>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setPaymentMethod(value as PaymentMethod);
                                }}
                                defaultValue={paymentMethod ?? ""}
                            >
                                <SelectTrigger id={"paymentMethod"} className="w-full max-w-48">
                                    <SelectValue placeholder="Payment Options" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select a Payment Method</SelectLabel>
                                        <SelectItem value={"card" as PaymentMethod}>
                                            Card
                                        </SelectItem>
                                        <SelectItem value={"paypal" as PaymentMethod}>
                                            PayPal
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <FieldSet className={paymentMethod !== "card" ? "hidden" : undefined}>
                    <PayByCardForm form={form} />
                </FieldSet>
                <FieldSet className={paymentMethod !== "paypal" ? "hidden" : undefined}>
                    <PayPalForm form={form} />
                </FieldSet>
                <Button className="w-fit self-center" type="submit">
                    Continue to {props.nextStep}
                </Button>
            </FieldGroup>
        </Form>
    );
}
