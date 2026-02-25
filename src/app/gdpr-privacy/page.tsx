import Link from "next/link";

export default function GDPRPrivacyPage() {
    return (
        <div className="bg-background">
            {/* HERO SECTION */}
            <section className="relative border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        GDPR & Privacy Policy
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Your privacy and data protection are important to us. This policy explains
                        how MovieShop collects, uses, and safeguards your personal data.
                    </p>
                </div>
            </section>

            {/* CONTENT WRAPPER */}
            <section className="mx-auto max-w-4xl px-6 py-20">
                <div className="space-y-10">
                    {/* CARD 1 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may collect personal information including your name, email address,
                            billing details, and purchase history.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We also collect technical data such as IP address, browser type, and
                            device information to improve platform performance.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">2. How We Use Your Data</h2>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                            <li>To process transactions and provide purchased content.</li>
                            <li>To improve our services and user experience.</li>
                            <li>To communicate important updates or security notices.</li>
                            <li>To comply with legal obligations.</li>
                        </ul>
                    </div>

                    {/* CARD 3 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">3. GDPR Rights (EU Users)</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you are located within the European Union, you have the right to:
                        </p>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                            <li>Access your personal data.</li>
                            <li>Request correction or deletion of your data.</li>
                            <li>Restrict or object to data processing.</li>
                            <li>Request data portability.</li>
                        </ul>
                    </div>

                    {/* CARD 4 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            MovieShop implements industry-standard security measures to protect your
                            information from unauthorized access, disclosure, alteration, or
                            destruction.
                        </p>
                    </div>

                    {/* CARD 5 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">5. Contact & Data Requests</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To exercise your privacy rights or request information about your stored
                            data, please visit our{" "}
                            <Link
                                href="/contact"
                                className="text-primary font-medium hover:underline"
                            >
                                Contact page
                            </Link>
                            .
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
