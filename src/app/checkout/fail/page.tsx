/**
 * Description:
 * Checkout failure page.
 * 
 * - Reads error param from searchParams
 * - Displays friendly failure message
 * - Does NOT modify order
 */

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
    searchParams: Promise<{
        err?: string;
        orderId?: string; // ADDED: Used to validate order status
    }>;
};

export default async function FailPage({ searchParams }: Props) {
    const params = await searchParams;

    let errorMessage: string | null = null;
    if (params.err) {
        try {
            const parsed = JSON.parse(params.err);
            if (parsed && typeof parsed === "object" && "message" in parsed) {
                const message = (parsed as { message?: unknown }).message;
                if (typeof message === "string" && message.trim().length > 0) {
                    errorMessage = message;
                }
            }
        } catch {
            errorMessage = null;
        }
    }

    // ADDED: Validate order status if orderId exists
    if (params.orderId) {
        const numericOrderId = Number(params.orderId);

        if (!isNaN(numericOrderId)) {
            const order = await prisma.order.findUnique({
                where: { id: numericOrderId },
            });

            // Block if order does not exist
            if (!order) {
                notFound();
            }

            // Block if order is already paid
            if (order.status === "PAID") {
                notFound();
            }
        }
    }

    return (
        <div className="min-h-screen bg-background px-4 py-12 md:py-16">
            <div className="mx-auto w-full max-w-2xl space-y-6">
                <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold">Payment Failed</h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        We could not process your payment. You can retry safely or choose a different method.
                    </p>

                    {errorMessage ? (
                        <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-left">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Error Details</p>
                            <p className="mt-1 text-sm">{errorMessage}</p>
                        </div>
                    ) : null}
                </section>

                <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                            href="/checkout"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
                        >
                            Retry Payment
                        </Link>

                        <Link
                            href="/cart"
                            className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted transition"
                        >
                            Back to Cart
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/checkout" className="text-sm text-primary hover:underline">
                            Change Payment Method
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}