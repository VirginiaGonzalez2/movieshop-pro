/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-24 14:33:17
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-27 09:58:58
 *   Description: Final step in checkout process.
 */

"use client";

import { checkout } from "@/actions/checkout";
// ADDED: Import backend confirmation after checkout
import { confirmOrderPayment } from "@/actions/confirm-order-payment";
import { Button } from "@/components/ui/button";
import { FieldContent, FieldGroup } from "@/components/ui/field";
import {
    CheckoutFormValues,
    checkoutSchema,
    FullPaymentMethodFormValues,
    OrderItemsFormValues,
} from "@/form-schemas/checkout";
import { ShippingAddressFormValues, ShippingMethodFormValues } from "@/form-schemas/shipping";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, RedirectType } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
    cart: OrderItemsFormValues;
    shippingAddress: ShippingAddressFormValues;
    shippingMethod: ShippingMethodFormValues;
    paymentMethod: FullPaymentMethodFormValues;
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
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        values: {
            orderItems: props.cart.orderItems,
            orderCost: props.cart.orderCost,
            ...props.shippingAddress,
            ...props.shippingMethod,
            ...props.paymentMethod,
        },
    });

    async function handleSubmit(values: CheckoutFormValues) {
        const result = await checkout(values);

        if (result.ok) {
            // ADDED: Confirm payment before redirecting to success page
            await confirmOrderPayment(result.order.id);

            redirect(`/checkout/success?orderId=${result.order.id}`, RedirectType.replace);
        } else {
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
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
                <FieldContent>Click here to place your order.</FieldContent>
                <Button className="w-fit self-center" type="submit">
                    Place Order
                </Button>
            </FieldGroup>
        </form>
    );
}

