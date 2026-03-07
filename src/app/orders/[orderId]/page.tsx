import { auth } from "@/lib/auth";
import { isOrderGuestAccessTokenValid } from "@/lib/order-access";
import { prisma } from "@/lib/prisma";
import { PriceTag } from "@/components/ui-localized/PriceTag";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

function getStatusBadgeClasses(status: string): string {
    switch (status) {
        case "PAID":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "SHIPPED":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "CANCELLED":
            return "bg-rose-50 text-rose-700 border-rose-200";
        case "REFUNDED":
            return "bg-amber-50 text-amber-700 border-amber-200";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200";
    }
}

export default async function OrderDetailsPage({
    params,
    searchParams,
}: {
    params: Promise<{ orderId: string }> | { orderId: string };
    searchParams?: Promise<{ access?: string }> | { access?: string };
}) {
    const resolved = await Promise.resolve(params);
    const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : undefined;
    const orderId = Number(resolved.orderId);

    if (Number.isNaN(orderId)) {
        notFound();
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
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

    const session = await auth.api.getSession({ headers: await headers() });

    const isOrderOwner = !!session &&
        (session.user.id === order.userId || session.user.email === order.userId);

    const hasValidGuestAccess = isOrderGuestAccessTokenValid(
        order.id,
        order.userId,
        resolvedSearchParams?.access,
    );

    if (!isOrderOwner && !hasValidGuestAccess) {
        redirect(`/login?from=orders/${order.id}`);
    }

    const itemTotal = order.items.reduce(
        (sum, item) => sum + Number(item.priceAtPurchase) * item.quantity,
        0,
    );

    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const buyerName = order.user?.name || "Guest Customer";
    const buyerEmail = order.user?.email || (order.userId.includes("@") ? order.userId : "N/A");

    return (
        <div className="mx-auto max-w-6xl py-10 px-4 space-y-6">
                <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold">Order Details</h1>
                        <Link
                            href="/orders"
                            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                        >
                            Back to Orders
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold">Order Details</h1>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Order ID
                            </p>
                            <p className="mt-1 text-lg font-semibold">#{order.id}</p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Date
                            </p>
                            <p className="mt-1 text-base font-semibold">
                                {new Date(order.orderDate).toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                <span
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-sm font-medium ${getStatusBadgeClasses(order.status)}`}
                                >
                                    {order.status}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                <PriceTag amount={Number(order.totalAmount)} />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Buyer Name
                            </p>
                            <p className="mt-1 font-medium">{buyerName}</p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Buyer Email
                            </p>
                            <p className="mt-1 font-medium break-all">{buyerEmail}</p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Items Count
                            </p>
                            <p className="mt-1 font-medium">{totalQuantity}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Products</h2>

                    <div className="divide-y">
                        {order.items.map((item) => (
                            <article key={item.id} className="py-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="h-20 w-14 overflow-hidden rounded-md bg-muted shrink-0">
                                            <Image
                                                src={
                                                    item.movie.imageUrl || "/placeholder-movie.jpg"
                                                }
                                                alt={item.movie.title}
                                                className="h-full w-full object-cover"
                                                width={80}
                                                height={56}
                                            />
                                        </div>

                                        <h3 className="text-sm md:text-base font-medium wrap-break-word">
                                            {item.movie.title}
                                        </h3>
                                    </div>

                                    <div className="text-right space-y-1 min-w-[140px]">
                                        <p className="text-xs text-muted-foreground">
                                            Qty: <span className="font-medium">{item.quantity}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Unit: <PriceTag amount={Number(item.priceAtPurchase)} />
                                        </p>
                                        <p className="text-sm font-semibold">
                                            Line: <PriceTag amount={Number(item.priceAtPurchase) * item.quantity} />
                                        </p>
                                        <Link
                                            href={`/movies/${item.movie.id}`}
                                            className="inline-block text-sm font-medium text-primary hover:underline whitespace-nowrap"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <PriceTag amount={itemTotal} />
                        </div>
                        <div className="flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <PriceTag amount={Number(order.totalAmount)} />
                        </div>
                    </div>
                </div>
            </div>
    );
}
