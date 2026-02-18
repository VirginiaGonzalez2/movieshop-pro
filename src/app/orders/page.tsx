import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Orders() {
    return (
        <AuthGuard>
            <div className="mx-auto max-w-2xl py-10 px-4">
                <h1 className="text-2xl font-bold mb-4">Orders</h1>
                <p>Here you can view your past orders.</p>
            </div>
        </AuthGuard>
    );
}
