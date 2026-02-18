import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ orderId: string }> | { orderId: string };
}) {
    const resolved = await Promise.resolve(params);
    const orderId = resolved.orderId;

    return (
        <AuthGuard>
            <div className="mx-auto max-w-2xl py-10 px-4">
                <h1 className="text-2xl font-bold mb-4">Order Details</h1>
                <p className="text-muted-foreground">Protected order details page placeholder.</p>

                <div className="mt-4 rounded border p-3 text-sm">
                    <span className="font-semibold">Order ID:</span> {orderId}
                </div>
            </div>
        </AuthGuard>
    );
}
