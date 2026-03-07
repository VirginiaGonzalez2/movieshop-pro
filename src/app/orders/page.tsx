import { AuthGuard } from "@/components/auth/AuthGuard";
import { PriceTag } from "@/components/ui-localized/PriceTag";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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

export default async function Orders() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/login?from=orders");
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Link legacy guest orders created with email to the authenticated user.
    await prisma.order.updateMany({
        where: { userId: userEmail },
        data: { userId },
    });

    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    movie: {
                        select: {
                            id: true,
                            title: true,
                            imageUrl: true,
                        },
                    },
                },
            },
        },
        orderBy: { orderDate: "desc" },
    });

    return (
        <AuthGuard>
            <div className="mx-auto max-w-5xl py-10 px-4 space-y-6">
                <section className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Orders</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review your purchases, order status, and item details.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                            <span className="text-muted-foreground">Customer: </span>
                            <span className="font-medium">{session.user.name || session.user.email}</span>
                        </div>
                    </div>
                </section>

                {orders.length === 0 ? (
                    <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                        You have no orders yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const total = order.items.reduce(
                                (sum, item) => sum + Number(item.priceAtPurchase) * item.quantity,
                                0,
                            );
                            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                            return (
                                <article
                                    key={order.id}
                                    className="rounded-xl border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-2 min-w-[220px]">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeClasses(order.status)}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                Placed on {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm min-w-[220px]">
                                            <span className="text-muted-foreground">Items</span>
                                            <span className="font-medium text-right">{itemCount}</span>

                                            <span className="text-muted-foreground">Order Total</span>
                                            <span className="font-semibold text-right">
                                                <PriceTag amount={total} />
                                            </span>
                                        </div>

                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition"
                                        >
                                            View Details
                                        </Link>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {order.items.slice(0, 4).map((item) => (
                                            <Image
                                                key={item.id}
                                                src={
                                                    item.movie.imageUrl || "/placeholder-movie.jpg"
                                                }
                                                alt={item.movie.title}
                                                className="h-16 w-12 rounded object-cover border"
                                                width={64}
                                                height={48}
                                            />
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
