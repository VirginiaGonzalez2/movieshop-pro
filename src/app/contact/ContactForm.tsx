"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/actions/contact";

const initialState = { success: false };

export default function ContactForm() {
    const [state, formAction] = useActionState(sendContactMessage, initialState);

    const formRef = useRef<HTMLFormElement>(null);

    /*
      When message is successfully sent:
      - Reset form
      - Scroll to top of form
    */
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="relative">
            <form
                ref={formRef}
                action={formAction}
                className="space-y-6 rounded-2xl border bg-card p-10 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        name="name"
                        required
                        className="w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                >
                    Send Message
                </button>
            </form>

            {/* SUCCESS POPUP */}
            {state?.success && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl animate-fade-in">
                    <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-sm">
                        <div className="text-4xl mb-3">🎉</div>
                        <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
                        <p className="text-sm text-muted-foreground">
                            Thank you for contacting us. We will reply within 24 hours.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
