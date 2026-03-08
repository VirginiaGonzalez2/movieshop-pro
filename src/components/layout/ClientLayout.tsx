"use client";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { PromoBar } from "@/components/layout/PromoBar";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Fetch promo config from API
    const { data: promo, error, isLoading } = useSWR("/api/promobar", async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch PromoBar config");
        return await res.json();
    }, { refreshInterval: 5000 }); // Poll every 5s for real-time updates

    // Parse visiblePages from promo config
    const visiblePages = promo?.visiblePages ? promo.visiblePages.split(",") : [];

    return (
        <>
            <AppHeader />
            {visiblePages.includes(pathname) && promo && <PromoBar promo={promo} />}
            <main className="p-2 flex-1 text-center">
                {children}
                <Toaster richColors />
            </main>
            <AppFooter />
        </>
    );
}
