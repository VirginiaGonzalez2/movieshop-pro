import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DealOfTheDayWidget from "@/components/deal-of-the-day/DealOfTheDayWidget";
import ClientLayout from "@/components/layout/ClientLayout";

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
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    return (
        <html lang="en">
            <head>
                {/* Google Analytics */}
                {gaId && (
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
                )}
                {gaId && (
                    <script dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`
                    }} />
                )}
                {/* Google Tag Manager */}
                {gtmId && (
                    <script dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`
                    }} />
                )}
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                {/* Google Tag Manager noscript */}
                {gtmId && (
                    <noscript>
                        <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
                    </noscript>
                )}
                <ClientLayout>{children}</ClientLayout>
                <DealOfTheDayWidget />
            </body>
        </html>
    );
}
