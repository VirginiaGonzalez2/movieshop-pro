import Link from "next/link";

export default function CustomerSupportPage() {
    return (
        <div className="bg-background">
            {/* HERO SECTION */}
            <section className="border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Customer Support
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We're here to help. Whether you have questions about purchases, technical
                        issues, or your account, our support team is ready to assist.
                    </p>
                </div>
            </section>

            {/* SUPPORT OPTIONS */}
            <section className="mx-auto max-w-4xl px-6 py-20">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* CONTACT SUPPORT CARD */}
                    <div className="rounded-2xl border bg-card p-10 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>

                        <p className="text-muted-foreground leading-relaxed mb-8">
                            Send us a message and our team will respond within 24–48 hours. Please
                            include your order number and relevant details to help us assist you
                            faster.
                        </p>

                        <Link
                            href="/contact"
                            className="inline-block rounded-xl bg-primary text-primary-foreground px-8 py-3 font-medium hover:opacity-90 transition"
                        >
                            Go to Contact Page
                        </Link>
                    </div>

                    {/* LIVE SUPPORT CARD */}
                    <div className="rounded-2xl border bg-card p-10 shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="mx-auto max-w-md">
                            <h2 className="text-2xl font-semibold mb-4">Live Support</h2>

                            <p className="text-muted-foreground leading-relaxed mb-8">
                                We are currently building a real-time chat feature to provide faster
                                assistance directly within your account dashboard.
                            </p>

                            <button
                                disabled
                                className="rounded-xl border px-8 py-3 font-medium text-muted-foreground cursor-not-allowed bg-muted/40"
                            >
                                Live Chat Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                {/* EXTRA INFO */}
                <div className="mt-16 text-center text-muted-foreground max-w-2xl mx-auto">
                    <p>
                        You may also find quick answers in our{" "}
                        <Link
                            href="/help-center"
                            className="text-primary font-medium hover:underline"
                        >
                            Help Center
                        </Link>
                        .
                    </p>
                </div>

                {/* FOOTNOTE */}
                <div className="pt-16 border-t text-sm text-muted-foreground text-center">
                    Support hours: Monday – Friday, 9:00 AM – 6:00 PM (CET)
                </div>
            </section>
        </div>
    );
}
