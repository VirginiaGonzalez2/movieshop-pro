import { deleteOrderAdminAction, updateOrderStatusAction } from "@/actions/admin-data";
import { requireAdminArea } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const statuses = Object.values(OrderStatus);

export default async function AdminOrdersPage() {
    await requireAdminArea("orders");

    const orders = await prisma.order.findMany({
        orderBy: { orderDate: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            items: {
                select: {
                    id: true,
                },
            },
        },
    });

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold">Orders</h2>
                <p className="text-sm text-muted-foreground">
                    Review orders and update fulfillment status.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    No orders yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 sm:p-5 space-y-3 bg-card">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        <span>Order #{order.id}</span>
                                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.authUserId
                                            ? `${order.user?.name ?? "User"} (${order.user?.email ?? order.authUserId})`
                                            : `Guest: ${order.userId}`}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {new Date(order.orderDate).toLocaleString()} • {order.items.length} items
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="font-medium">Total: ${order.totalAmount.toString()}</div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <form action={updateOrderStatusAction.bind(null, order.id)}>
                                        <div className="flex items-center gap-2">
                                            <select
                                                name="status"
                                                defaultValue={order.status}
                                                className="border rounded-md px-2 py-1 text-sm bg-background"
                                            >
                                                {statuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </form>

                                    <form action={deleteOrderAdminAction.bind(null, order.id)}>
                                        <button
                                            type="submit"
                                            className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
