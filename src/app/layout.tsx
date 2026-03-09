import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DealOfTheDayWidget from "@/components/deal-of-the-day/DealOfTheDayWidget";
import ClientLayout from "@/components/layout/ClientLayout";
// ...existing code...

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "A+ MovieShop",
    description: "Get your movies here!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
            <ClientLayout>{children}</ClientLayout>
            <DealOfTheDayWidget />
            </body>
        </html>
    );
// ...existing code...
}
