/**
 * Success Page
 *
 * IMPORTANT:
 * - Minimal implementation
 * - Uses existing Order model
 * - Does NOT modify order status logic
 * - Adds proper Prisma typing for included relations
 * - Converts Prisma Decimal for safe UI rendering
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

/*
  ADDED:
  Extended Prisma type including movie relation.
  This fixes TypeScript error when accessing item.movie.
  We do NOT change database logic — only typing.
*/
type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                movie: true;
            };
        };
    };
}>;

type Props = {
    searchParams: Promise<{
        orderId?: string;
    }>;
};

export default async function SuccessPage({ searchParams }: Props) {
    const params = await searchParams;
    const orderId = params.orderId;

    if (!orderId) {
        notFound();
    }

    /*
      ADDED (defensive improvement):
      Convert orderId safely to number and validate it.
      This prevents NaN being passed to Prisma.
      Does NOT change business logic.
    */
    const numericOrderId = Number(orderId);

    if (isNaN(numericOrderId)) {
        notFound();
    }

    /*
      ADDED:
      Explicitly typing the query result so TypeScript
      understands that items include movie relation.
    */
    const order: OrderWithItems | null = await prisma.order.findUnique({
        where: { id: numericOrderId },
        include: {
            items: {
                include: {
                    movie: true,
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    // ADDED: Ensure only PAID orders can access success page
    if (order.status !== "PAID") {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background px-4 py-12 md:py-16">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                    <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Your next purchase discount code</p>
                        <p className="text-2xl font-bold tracking-wide">NEXT20</p>
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/movies"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
                        >
                            Continue Shopping
                        </Link>

                        <Link
                            href={`/login?from=orders/${order.id}`}
                            className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted transition"
                        >
                            View Your Order
                        </Link>

                        <Link
                            href={`/register?from=orders/${order.id}`}
                            className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </section>

                <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold">Payment confirmed</h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Thank you for your purchase. Your order is now confirmed.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-muted/30 px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Order Number
                            </p>
                            <p className="text-xl font-bold leading-tight">#{order.id}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Purchased Movies</h2>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {order.items.map((item) => (
                            <article key={item.id} className="rounded-xl border bg-background p-3">
                                <img
                                    src={item.movie.imageUrl || "/placeholder-movie.jpg"}
                                    alt={item.movie.title}
                                    className="w-full aspect-[2/3] object-cover rounded-md mb-3"
                                />

                                <p className="font-medium text-sm line-clamp-2 min-h-10">{item.movie.title}</p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    ${Number(item.priceAtPurchase).toFixed(2)}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}