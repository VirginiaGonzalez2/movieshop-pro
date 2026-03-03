import { AuthGuard } from "@/components/auth/AuthGuard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

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
                <h1 className="text-2xl font-bold mb-4">Orders</h1>

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

                            return (
                                <article key={order.id} className="rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-sm">
                                            <p>
                                                <span className="font-semibold">Order ID:</span> #{order.id}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="text-sm">
                                            <p>
                                                <span className="font-semibold">Status:</span> {order.status}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Total:</span> ${total.toFixed(2)}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-muted transition"
                                        >
                                            View Details
                                        </Link>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {order.items.slice(0, 4).map((item) => (
                                            <img
                                                key={item.id}
                                                src={item.movie.imageUrl || "/placeholder-movie.jpg"}
                                                alt={item.movie.title}
                                                className="h-16 w-12 rounded object-cover border"
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
