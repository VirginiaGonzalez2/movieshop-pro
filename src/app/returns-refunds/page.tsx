import Link from "next/link";

export default function ReturnsRefundsPage() {
    return (
        <div className="bg-background">
            {/* HERO SECTION */}
            <section className="relative border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Returns & Refunds
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Transparency and trust are core to MovieShop. Below you’ll find clear
                        policies regarding digital purchases and refund eligibility.
                    </p>
                </div>
            </section>

            {/* CONTENT WRAPPER */}
            <section className="mx-auto max-w-4xl px-6 py-20">
                <div className="space-y-10">
                    {/* CARD 1 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">Digital Product Policy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            MovieShop provides digital streaming and downloadable content. Once
                            access has been granted, purchases are generally considered final.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            If technical issues prevent access, please contact our support team
                            within 7 days of purchase.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">Refund Eligibility</h2>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                            <li>Duplicate purchases made in error.</li>
                            <li>Unresolved technical failures.</li>
                            <li>Accidental purchases reported within 24 hours.</li>
                        </ul>
                    </div>

                    {/* CARD 3 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">Refund Process</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Approved refunds are processed within 5–10 business days. Funds are
                            returned using the original payment method.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            A confirmation email will be sent once the refund is completed.
                        </p>
                    </div>

                    {/* CARD 4 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">Requesting a Refund</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To initiate a request, please visit our{" "}
                            <Link
                                href="/contact"
                                className="text-primary font-medium hover:underline"
                            >
                                Contact page
                            </Link>{" "}
                            and include your order number, movie title, and a brief explanation of
                            the issue.
                        </p>
                    </div>

                    {/* FOOTNOTE */}
                    <div className="pt-10 border-t text-sm text-muted-foreground text-center">
                        Last updated: February 2026
                    </div>
                </div>
            </section>
        </div>
    );
}
