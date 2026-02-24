import Link from "next/link";

export default function BuyingGuidePage() {
    return (
        <div className="bg-background">
            {/* HERO SECTION */}
            <section className="relative border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Buying Guide</h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know before purchasing on MovieShop — from choosing
                        the right movie to understanding access and playback.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-4xl px-6 py-20">
                <div className="space-y-10">
                    {/* CARD 1 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">1. How Purchases Work</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            MovieShop offers digital streaming and downloadable movie content. Once
                            a purchase is completed, access is instantly granted to your account.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            You can stream your purchased movies anytime from your device.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">2. Choosing the Right Movie</h2>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                            <li>Check the genre and rating before purchasing.</li>
                            <li>Review runtime and description for full details.</li>
                            <li>Watch available trailers before checkout.</li>
                            <li>Verify language and subtitle availability.</li>
                        </ul>
                    </div>

                    {/* CARD 3 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">3. Payment Methods</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We support secure online payments including major credit cards and other
                            approved payment providers. All transactions are encrypted and processed
                            securely.
                        </p>
                    </div>

                    {/* CARD 4 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">
                            4. Access & Device Compatibility
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Purchased movies can be accessed through your account dashboard.
                        </p>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                            <li>Desktop browsers (Chrome, Safari, Edge)</li>
                            <li>Tablets and mobile devices</li>
                            <li>Supported smart TVs (where applicable)</li>
                        </ul>
                    </div>

                    {/* CARD 5 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">5. Need Help?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you experience issues before or after purchase, our team is here to
                            help. Visit our{" "}
                            <Link
                                href="/contact"
                                className="text-primary font-medium hover:underline"
                            >
                                Contact page
                            </Link>{" "}
                            for assistance.
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
