"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpCenterPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I access my purchased movies?",
            answer: "After purchase, movies are available in your account dashboard. Simply log in and access your library.",
        },
        {
            question: "Can I download movies?",
            answer: "Some titles may support download functionality depending on licensing agreements.",
        },
        {
            question: "Why was my payment declined?",
            answer: "Payments may be declined due to insufficient funds, expired cards, or security restrictions from your bank.",
        },
        {
            question: "How do I request a refund?",
            answer: "Visit our Contact page and include your order number along with a brief explanation of the issue.",
        },
        {
            question: "How do I reset my account password?",
            answer: "Use the 'Forgot Password' option on the login page and follow the email instructions.",
        },
    ];

    return (
        <div className="bg-background">
            {/* HERO */}
            <section className="border-b bg-gradient-to-b from-muted/40 to-background">
                <div className="mx-auto max-w-4xl px-6 py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Help Center</h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Need assistance? Find answers to common questions or get in touch with our
                        support team.
                    </p>
                </div>
            </section>

            {/* ACTION BUTTONS */}
            <section className="mx-auto max-w-4xl px-6 py-16">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href="/contact"
                        className="rounded-xl bg-primary text-primary-foreground px-8 py-3 font-medium text-center hover:opacity-90 transition"
                    >
                        Contact Support
                    </Link>

                    <Link
                        href="/customer-support"
                        className="rounded-xl border px-8 py-3 font-medium text-center hover:bg-muted transition"
                    >
                        Live Customer Support
                    </Link>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="mx-auto max-w-4xl px-6 pb-24">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Frequently Asked Questions
                    </h2>

                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-2xl border bg-card shadow-sm">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left px-6 py-5 font-medium flex justify-between items-center"
                            >
                                {faq.question}
                                <span>{openIndex === index ? "−" : "+"}</span>
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
