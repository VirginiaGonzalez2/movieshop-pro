import { AuthGuard } from "@/components/auth/AuthGuard";

export default function CheckoutPage() {
    return (
        <AuthGuard>
            <div className="mx-auto max-w-2xl py-10 px-4">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p className="text-muted-foreground">
                    Checkout page placeholder (protected). The checkout flow will be implemented
                    here.
                </p>
            </div>
        </AuthGuard>
    );
}
