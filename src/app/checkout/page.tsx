"use server";

// SEO metadata for Checkout page
export const metadata = {
    title: "Checkout - A+ MovieShop",
    description: "Complete your purchase and enjoy your movies instantly.",
    openGraph: {
        title: "Checkout - A+ MovieShop",
        description: "Complete your purchase and enjoy your movies instantly.",
        url: "https://tu-dominio.com/checkout",
        images: [
            {
                url: "https://tu-dominio.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "A+ MovieShop",
            },
        ],
    },
};

import { getShoppingCartInfo } from "@/actions/shopping-cart";
import { Checkout } from "./_components/Checkout";
import { redirect } from "next/navigation";
import { calculateOrderPrices } from "@/actions/checkout";

type Props = {
    searchParams: Promise<{
        buy?: number;
    }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
    let orderItems: { id: number; quantity?: number; cost?: number }[];

    const params = await searchParams;

    let buyNow = false;

    if (!params.buy) {
        const shoppingCartInfo = await getShoppingCartInfo();

        if (!shoppingCartInfo) {
            redirect("/");
        }

        orderItems = shoppingCartInfo.map((value) => {
            return { id: value.itemId, quantity: value.quantity };
        });
    } else {
        orderItems = [{ id: params.buy }];
        buyNow = true;
    }

    // const shoppingCartInfo = await getShoppingCartInfo();

    // if (!shoppingCartInfo) {
    //     // Should not be on this page with an empty cart.
    //     // TODO: Redirect to some error page (checkout fail?) or maybe home is fine?
    //     redirect("/");
    // }

    // const orderItems = shoppingCartInfo.map((value) => {
    //     return { id: value.itemId, quantity: value.quantity, cost: value.price };
    // });

    // let orderCost = 0;
    // for (const item of orderItems) {
    //     orderCost += item.cost * item.quantity;
    // }

    // TODO: (FUTURE) check stock and reserve items at this point to avoid conflicts.

    const orderPrices = await calculateOrderPrices(orderItems);

    return (
        <div className="mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <Checkout
                orderItems={orderItems}
                orderCost={orderPrices.totalOrderCost}
                buyNow={buyNow}
            />
        </div>
    );
}
