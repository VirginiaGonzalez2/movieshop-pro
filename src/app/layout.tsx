import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import GlobalHeader from "./_components/global-header";
import GlobalFooter from "./_components/global-footer";

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
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-full gap-4 flex flex-col justify-between`}>
                <GlobalHeader className="p-1 flex-0" />
                <div className="p-2 flex-1 text-center overflow-y-auto">
                    {children}
                    <Toaster richColors />
                </div>
                <GlobalFooter className="p-1 flex-0" />
            </body>
        </html>
    );
}
