import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import GlobalHeader from "./_components/global-header";
import GlobalFooter from "./_components/global-footer";
import { twMerge } from "tailwind-merge";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body
                className={twMerge(
                    geistSans.variable,
                    geistMono.variable,
                    "antialiased h-full flex flex-col items-stretch bg-background text-foreground",
                )}>
                <GlobalHeader />
                <div className="flex-1 overflow-y-auto">
                    {children}
                    <Toaster richColors />
                </div>
                <GlobalFooter />
            </body>
        </html>
    );
}
