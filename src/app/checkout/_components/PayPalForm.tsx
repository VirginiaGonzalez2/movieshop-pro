"use client";

/**
 * Author: Sabrina Bjurman
 * Extended by: Maria Virgina Gonzalez
 *
 * Description:
 * Original PayPal email field kept intact.
 * Added PayPal JS SDK button BELOW the existing input.
 *
 * IMPORTANT:
 * - No changes to form schema
 * - No changes to Controller
 * - No new form fields added
 * - Only UI enhancement
 * - Reuses existing checkout submit logic
 */

import { useEffect, useRef } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethodFormValues } from "@/form-schemas/payment";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
};

export function PayPalForm({ form }: Props) {
    /*
       ADDED:
       Ref to render the PayPal button safely.
       This does NOT interfere with the existing form logic.
    */
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const loadScript = () => {
            if (window.paypal) {
                renderButtons();
                return;
            }

            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
            script.async = true;

            script.onload = () => {
                renderButtons();
            };

            document.body.appendChild(script);
        };

        const renderButtons = () => {
            if (!paypalRef.current || !window.paypal) return;

            window.paypal
                .Buttons({
                    style: {
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "paypal",
                    },

                    /*
                       ADDED:
                       Minimal PayPal order creation.
                       Does NOT touch your database.
                       Does NOT modify checkout logic.
                    */
                    createOrder: (_data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: "1.00", // Placeholder amount (can later connect to real total)
                                    },
                                },
                            ],
                        });
                    },

                    /*
                       ADDED:
                       After PayPal approval, trigger the existing checkout form submission.
                       
                       This reuses the current form submit logic inside PlaceOrder.tsx
                       without modifying architecture or server actions.
                    */
                    onApprove: async (_data: any, actions: any) => {
                        await actions.order.capture();

                        console.log("PayPal payment approved");

                        // Trigger existing checkout form submission
                        // This simulates clicking the "Place Order" button
                        document.querySelector("form")?.requestSubmit();
                    },

                    onError: (err: any) => {
                        console.error("PayPal error:", err);
                    },
                })
                .render(paypalRef.current);
        };

        loadScript();
    }, []);

    return (
        <>
            {/* ORIGINAL CODE — UNCHANGED */}
            <Controller
                control={form.control}
                name="paymentPayPalInfo.payPalEmail"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            PayPal E-mail
                        </FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            autoComplete="email"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* ADDED: PayPal Button container */}
            <div className="mt-4" ref={paypalRef} />
        </>
    );
}