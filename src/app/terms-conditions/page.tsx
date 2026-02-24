import Link from "next/link";

export default function TermsConditionsPage() {
    return (
        <div className="bg-background">
            {/* HERO SECTION */}
            <section className="relative border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Terms & Conditions
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using MovieShop. By accessing or
                        purchasing from our platform, you agree to the terms outlined below.
                    </p>
                </div>
            </section>

            {/* CONTENT WRAPPER */}
            <section className="mx-auto max-w-4xl px-6 py-20">
                <div className="space-y-10">
                    {/* CARD 1 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using MovieShop, you confirm that you are at least 18
                            years old or have parental consent and agree to comply with these Terms
                            & Conditions.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">2. Digital Content Usage</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            All movies purchased or streamed through MovieShop are licensed for
                            personal, non-commercial use only.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Redistribution, reproduction, resale, or public performance without
                            authorization is strictly prohibited.
                        </p>
                    </div>

                    {/* CARD 3 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">3. Payments & Pricing</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All prices are displayed in local currency and may change without prior
                            notice. MovieShop reserves the right to correct pricing errors or cancel
                            transactions in the event of technical inaccuracies.
                        </p>
                    </div>

                    {/* CARD 4 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">4. Account Responsibility</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account
                            credentials. Any activity performed under your account is your
                            responsibility.
                        </p>
                    </div>

                    {/* CARD 5 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            MovieShop shall not be held liable for indirect, incidental, or
                            consequential damages arising from the use of our services.
                        </p>
                    </div>

                    {/* CARD 6 */}
                    <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-4">6. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions regarding these terms, please visit our{" "}
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
