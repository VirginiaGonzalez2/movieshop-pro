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

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethodFormValues } from "@/form-schemas/payment";
import {
    PAYPAL_APPROVED_COOKIE_KEY,
    PAYPAL_APPROVED_LOCAL_KEY,
    PAYPAL_APPROVED_SESSION_KEY,
} from "@/lib/payment-flags";
import { useEffect, useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = {
    form: UseFormReturn<PaymentMethodFormValues>;
    orderCost: number;
    onApprovalChange: (approved: boolean) => void;
};

function resolvePayPalSandboxClientId() {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const rawClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
    if (!rawClientId) return isDevelopment ? "sb" : null;

    const normalized = rawClientId.toLowerCase();
    if (
        normalized === "tu_client_id_aqui" ||
        normalized === "your_client_id_here" ||
        normalized === "replace_with_paypal_client_id"
    ) {
        return isDevelopment ? "sb" : null;
    }

    if (normalized === "sb") {
        return isDevelopment ? "sb" : null;
    }

    return rawClientId;
}

export function PayPalForm({ form, orderCost, onApprovalChange }: Props) {
    /*
       ADDED:
       Ref to render the PayPal button safely.
       This does NOT interfere with the existing form logic.
    */
    const paypalRef = useRef<HTMLDivElement>(null);
    const buttonsInstanceRef = useRef<unknown>(null);
    const [sdkError, setSdkError] = useState<string | null>(null);

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

    useEffect(() => {
        if (typeof window === "undefined") return;

        const paypalClientId = resolvePayPalSandboxClientId();
        let isDisposed = false;

        if (!paypalClientId) {
            clearPayPalApproval();
            setSdkError(
                "PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID with a valid client id.",
            );
            return;
        }

        setSdkError(null);

        const loadScript = () => {
            if (window.paypal) {
                renderButtons();
                return;
            }

            const existing = document.querySelector<HTMLScriptElement>(
                'script[src*="paypal.com/sdk/js"]',
            );

            if (existing) {
                if (existing.dataset.loaded === "true") {
                    renderButtons();
                    return;
                }

                existing.addEventListener("load", renderButtons, { once: true });
                existing.addEventListener(
                    "error",
                    () => {
                        clearPayPalApproval();
                        setSdkError("Unable to load PayPal Sandbox. Please refresh and try again.");
                    },
                    { once: true },
                );
                return;
            }

            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=USD&intent=capture`;
            script.async = true;

            script.onload = () => {
                script.dataset.loaded = "true";
                renderButtons();
            };

            script.onerror = () => {
                clearPayPalApproval();
                setSdkError("Unable to load PayPal Sandbox. Please refresh and try again.");
            };

            document.body.appendChild(script);
        };

        const renderButtons = () => {
            if (isDisposed || !paypalRef.current || !window.paypal) return;

            paypalRef.current.innerHTML = "";
            buttonsInstanceRef.current?.close?.();
            buttonsInstanceRef.current = null;
            setSdkError(null);

            const normalizedTotal = Math.max(0.01, Number(orderCost) || 0);
            const amountValue = normalizedTotal.toFixed(2);

            let buttons: unknown;
            try {
                buttons = window.paypal.Buttons({
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    createOrder: (_data: any, actions: any) => {
                        clearPayPalApproval();

                        if (!actions?.order?.create) {
                            throw new Error("PayPal actions.order.create is unavailable.");
                        }

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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onApprove: async (_data: any, actions: any) => {
                        try {
                            if (!actions?.order?.capture) {
                                throw new Error("PayPal actions.order.capture is unavailable.");
                            }

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
                            setSdkError(
                                "PayPal payment could not be completed. Please try again or use another method.",
                            );
                        }
                    },

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onError: (err: any) => {
                        console.error("PayPal error:", err);
                        clearPayPalApproval();
                        setSdkError(
                            "PayPal returned an error while processing your payment. Please retry.",
                        );
                    },

                    onCancel: () => {
                        clearPayPalApproval();
                        setSdkError("PayPal payment was canceled.");
                    },
                });
            } catch (error) {
                console.error("PayPal Buttons init error:", error);
                clearPayPalApproval();
                setSdkError("PayPal could not initialize. Please refresh and try again.");
                return;
            }

            if (!buttons || (typeof buttons.isEligible === "function" && !buttons.isEligible())) {
                clearPayPalApproval();
                setSdkError("PayPal is not eligible for this checkout/session.");
                return;
            }

            buttonsInstanceRef.current = buttons;

            void buttons.render(paypalRef.current).catch((err: unknown) => {
                console.error("PayPal render error:", err);
                clearPayPalApproval();
                setSdkError("PayPal could not initialize correctly. Please refresh and try again.");
            });
        };

        loadScript();

        return () => {
            isDisposed = true;
            buttonsInstanceRef.current?.close?.();
            buttonsInstanceRef.current = null;
        };
    }, [orderCost, onApprovalChange]);

    return (
        <>
            {/* ORIGINAL CODE — UNCHANGED */}
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

            {/* ADDED: PayPal Button container */}
            <div className="mt-4" ref={paypalRef} />

            {sdkError && <p className="mt-2 text-sm text-red-600">{sdkError}</p>}
        </>
    );
}
