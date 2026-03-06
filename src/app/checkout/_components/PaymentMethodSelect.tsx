/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 16:57:39
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-06 12:40:26
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
import { FullPaymentMethodFormValues } from "@/form-schemas/checkout";
import {
    PaymentMethod,
    PaymentMethodFormValues,
    paymentMethodSchema,
} from "@/form-schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PayByCardForm } from "./PayByCardForm";
import { PayPalForm } from "./PayPalForm";

type Props = {
    nextStep: string;
    savedValues: FullPaymentMethodFormValues | null;
    orderCost: number;
    onPayPalApprovedChange: (approved: boolean) => void;
    onSubmit: (values: PaymentMethodFormValues) => void;
};

export function PaymentMethodSelect(props: Props) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        props.savedValues?.paymentMethod ?? "card",
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

    return (
        <form onSubmit={form.handleSubmit(props.onSubmit)}>
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
                                defaultValue={paymentMethod}
                            >
                                <SelectTrigger className="w-full max-w-48">
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
                    <PayPalForm
                        form={form}
                        orderCost={props.orderCost}
                        onApprovalChange={props.onPayPalApprovedChange}
                    />
                </FieldSet>
                <Button className="w-fit self-center" type="submit">
                    Continue to {props.nextStep}
                </Button>
            </FieldGroup>
        </form>
    );
}
