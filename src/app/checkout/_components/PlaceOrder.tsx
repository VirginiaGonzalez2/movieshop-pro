/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-24 14:33:17
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-09 08:57:35
 *   Description: Final step in checkout process.
 */

"use client";

import { checkout } from "@/actions/checkout";
// ADDED: Import backend confirmation after checkout
import { confirmOrderPayment } from "@/actions/confirm-order-payment";
import { clearShoppingCart } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";
import { FieldContent, FieldGroup } from "@/components/ui/field";
import {
    PAYPAL_APPROVED_COOKIE_KEY,
    PAYPAL_APPROVED_LOCAL_KEY,
    PAYPAL_APPROVED_SESSION_KEY,
} from "@/lib/payment-flags";
import {
    CheckoutFormValues,
    checkoutSchema,
    FullPaymentMethodFormValues,
    OrderItemFormValues,
} from "@/form-schemas/checkout";
import { ShippingAddressFormValues, ShippingMethodFormValues } from "@/form-schemas/shipping";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type Props = {
    orderItems: OrderItemFormValues[];
    shippingAddress: ShippingAddressFormValues;
    shippingMethod: ShippingMethodFormValues;
    paymentMethod: FullPaymentMethodFormValues;
    paypalApproved: boolean;
    autoSubmit?: boolean;
    buyNow: boolean;
};

// ADDED: Narrow unknown runtime shapes safely before reading orderId in the fail branch.
function hasOrderId(value: unknown): value is { order: { id: number } } {
    if (!value || typeof value !== "object") return false;
    if (!("order" in value)) return false;

    const order = (value as { order?: unknown }).order;
    if (!order || typeof order !== "object") return false;

    return typeof (order as { id?: unknown }).id === "number";
}

export function PlaceOrder(props: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const autoSubmittedRef = useRef(false);

    const form = useForm<Partial<CheckoutFormValues>>({
        resolver: zodResolver(checkoutSchema.partial()),
        values: {
            orderItems: props.orderItems,
            buyNow: props.buyNow,
            ...props.shippingAddress,
            ...props.shippingMethod,
            ...props.paymentMethod,
        },
    });

    useEffect(() => {
        if (!props.autoSubmit || autoSubmittedRef.current) return;

        autoSubmittedRef.current = true;
        formRef.current?.requestSubmit();
    }, [props.autoSubmit]);

    async function handleSubmit(values: Partial<CheckoutFormValues>) {
        console.log("handleSubmit");

        const isPayPal = values.paymentMethod === "paypal";
        const paypalEmail = values.paymentPayPalInfo?.payPalEmail?.toLowerCase().trim();
        const isSandboxBypassEmail =
            process.env.NODE_ENV === "development" && paypalEmail === "marisilva703@gmail.com";
        const isSandboxForcedFailEmail =
            process.env.NODE_ENV === "development" &&
            (paypalEmail === "sb-9aklq49665943@personal.example.com" ||
                paypalEmail === "sb-hroje49777269@personal.example.com");

        if (isPayPal && typeof window !== "undefined") {
            if (isSandboxForcedFailEmail) {
                const params = new URLSearchParams();
                params.set(
                    "err",
                    JSON.stringify({
                        message: "Sandbox test: forced failed payment for this PayPal email.",
                    }),
                );

                redirect(`/checkout/fail?${params.toString()}`, RedirectType.replace);
            }

            const isPayPalApprovedInState = props.paypalApproved;
            const isPayPalApprovedInSession =
                window.sessionStorage.getItem(PAYPAL_APPROVED_SESSION_KEY) === "true";
            const isPayPalApprovedInLocal =
                window.localStorage.getItem(PAYPAL_APPROVED_LOCAL_KEY) === "true";
            const isPayPalApprovedInCookie = document.cookie
                .split(";")
                .some((cookie) => cookie.trim() === `${PAYPAL_APPROVED_COOKIE_KEY}=true`);
            const isPayPalApproved =
                isPayPalApprovedInState ||
                isPayPalApprovedInSession ||
                isPayPalApprovedInLocal ||
                isPayPalApprovedInCookie;

            if (!isPayPalApproved) {
                const params = new URLSearchParams();
                params.set(
                    "err",
                    JSON.stringify({
                        message:
                            "PayPal payment was not confirmed. Please complete PayPal approval before placing the order.",
                    }),
                );

                redirect(`/checkout/fail?${params.toString()}`, RedirectType.replace);
            }
        }

        const result = await checkout(values as CheckoutFormValues);

        if (result.ok) {
            // ADDED: Confirm payment before redirecting to success page
            await confirmOrderPayment(result.order.id);
            if (!values.buyNow) {
                await clearShoppingCart();
            }

            if (isPayPal && typeof window !== "undefined") {
                window.sessionStorage.removeItem(PAYPAL_APPROVED_SESSION_KEY);
                window.localStorage.removeItem(PAYPAL_APPROVED_LOCAL_KEY);
                // eslint-disable-next-line react-hooks/immutability
                document.cookie = `${PAYPAL_APPROVED_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
            }

            redirect(`/checkout/success?orderId=${result.order.id}`, RedirectType.replace);
        } else {
            if (isPayPal && typeof window !== "undefined") {
                window.sessionStorage.removeItem(PAYPAL_APPROVED_SESSION_KEY);
                window.localStorage.removeItem(PAYPAL_APPROVED_LOCAL_KEY);
                // eslint-disable-next-line react-hooks/immutability
                document.cookie = `${PAYPAL_APPROVED_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
            }

            const params = new URLSearchParams();

            // ADDED: Pass orderId if available to allow status validation on fail page
            if (hasOrderId(result)) {
                params.set("orderId", String(result.order.id));
            }

            params.set("err", JSON.stringify(result.error));

            redirect(`/checkout/fail?${params}`, RedirectType.replace);
        }
    }

    return (
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
                <FieldContent>Click here to place your order.</FieldContent>
                <Button className="w-fit self-center" type="submit">
                    Place Order
                </Button>
            </FieldGroup>
        </form>
    );
}
