"use server";

import { Checkout } from "./_components/Checkout";

export default async function CheckoutPage() {
    return (
        <div className="mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <Checkout />
        </div>
    );
}
