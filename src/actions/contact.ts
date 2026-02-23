"use server";

import { prisma } from "@/lib/prisma";
import ContactNotification from "@/emails/ContactNotification";
import { Resend } from "resend";
import CustomerConfirmation from "@/emails/CustomerConfirmation";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(prevState: { success: boolean }, formData: FormData) {
    // Extract form values from submitted form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { success: false };
    }

    try {
        // 1️⃣ Save message to database
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
            },
        });

        // 2️⃣ Send email notification to team inbox
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "aplusmovieshop.team@gmail.com",
            subject: "New Contact Message - A+ MovieShop",
            react: ContactNotification({
                name,
                email,
                message,
            }),
        });

        // 3️⃣ Send automatic confirmation email to customer
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email, // <-- restored original behavior
            subject: "We received your message 🎬",
            react: CustomerConfirmation({
                name,
            }),
        });

        return { success: true };
    } catch (error) {
        console.error("Contact form error:", error);
        return { success: false };
    }
}
