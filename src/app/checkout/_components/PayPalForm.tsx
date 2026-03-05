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
import {
    PAYPAL_APPROVED_COOKIE_KEY,
    PAYPAL_APPROVED_LOCAL_KEY,
    PAYPAL_APPROVED_SESSION_KEY,
} from "@/lib/payment-flags";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
    orderCost: number;
    onApprovalChange: (approved: boolean) => void;
};

export function PayPalForm({ form, orderCost, onApprovalChange }: Props) {
    /*
       ADDED:
       Ref to render the PayPal button safely.
       This does NOT interfere with the existing form logic.
    */
    const paypalRef = useRef<HTMLDivElement>(null);

    function clearPayPalApproval() {
        window.sessionStorage.removeItem(PAYPAL_APPROVED_SESSION_KEY);
        window.localStorage.removeItem(PAYPAL_APPROVED_LOCAL_KEY);
        document.cookie = `${PAYPAL_APPROVED_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
        onApprovalChange(false);
    }

    function setPayPalApproval() {
        window.sessionStorage.setItem(PAYPAL_APPROVED_SESSION_KEY, "true");
        window.localStorage.setItem(PAYPAL_APPROVED_LOCAL_KEY, "true");
        document.cookie = `${PAYPAL_APPROVED_COOKIE_KEY}=true; Max-Age=900; Path=/; SameSite=Lax`;
        onApprovalChange(true);
    }

    function redirectToFail(message: string) {
        const params = new URLSearchParams();
        params.set("err", JSON.stringify({ message }));
        window.location.href = `/checkout/fail?${params.toString()}`;
    }

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

            paypalRef.current.innerHTML = "";

            const normalizedTotal = Math.max(0.01, Number(orderCost) || 0);
            const amountValue = normalizedTotal.toFixed(2);

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
                        clearPayPalApproval();

                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: amountValue,
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
                        try {
                            const captureResult = await actions.order.capture();
                            if (captureResult?.status !== "COMPLETED") {
                                throw new Error("PayPal capture is not COMPLETED.");
                            }

                            setPayPalApproval();
                            console.log("PayPal payment approved");

                            paypalRef.current?.closest("form")?.requestSubmit();
                        } catch (error) {
                            console.error("PayPal capture failed:", error);
                            clearPayPalApproval();
                            redirectToFail(
                                "PayPal payment could not be completed. Please try again or use another method.",
                            );
                        }
                    },

                    onError: (err: any) => {
                        console.error("PayPal error:", err);
                        clearPayPalApproval();
                        redirectToFail(
                            "PayPal returned an error while processing your payment. Please try again.",
                        );
                    },

                    onCancel: () => {
                        clearPayPalApproval();
                        redirectToFail("PayPal payment was canceled.");
                    },
                })
                .render(paypalRef.current);
        };

        loadScript();
    }, [orderCost, onApprovalChange]);

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