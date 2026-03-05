"use server";

import { prisma } from "@/lib/prisma";
import ContactNotification from "@/emails/ContactNotification";
import { Resend } from "resend";
import CustomerConfirmation from "@/emails/CustomerConfirmation";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(prevState: { success: boolean }, formData: FormData) {
    // Extract and normalize form values from submitted form
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const message = String(formData.get("message") ?? "").trim();

    // Basic validation to ensure required fields exist
    if (!name || !email || !message) {
        return { success: false };
    }

    try {
        // 1️⃣ Save message to database (source of truth)
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
            },
        });
    } catch (error) {
        console.error("Contact form DB error:", error);
        return { success: false };
    }

    // 2️⃣ & 3️⃣ Send emails in best-effort mode; DB save should not fail because of email issues
    if (!process.env.RESEND_API_KEY) {
        return { success: true };
    }

    try {
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

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "We received your message 🎬",
            react: CustomerConfirmation({
                name,
            }),
        });
    } catch (error) {
        console.error("Contact form email warning:", error);
    }

    return { success: true };
}
