import { AuthGuard } from "@/components/auth/AuthGuard";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ orderId: string }> | { orderId: string };
}) {
    const resolved = await Promise.resolve(params);
    const orderId = Number(resolved.orderId);

    if (Number.isNaN(orderId)) {
        notFound();
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
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

    const itemTotal = order.items.reduce(
        (sum, item) => sum + Number(item.priceAtPurchase) * item.quantity,
        0,
    );

    return (
        <AuthGuard>
            <div className="mx-auto max-w-6xl py-10 px-4 space-y-6">
                <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                    <h1 className="text-2xl font-bold">Order Details</h1>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Order ID
                            </p>
                            <p className="mt-1 text-lg font-semibold">#{order.id}</p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Status
                            </p>
                            <p className="mt-1 text-lg font-semibold">{order.status}</p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold">${itemTotal.toFixed(2)}</p>
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

                                    <Link
                                        href={`/movies/${item.movie.id}`}
                                        className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
