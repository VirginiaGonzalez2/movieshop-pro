// SEO metadata for HomePage (Next.js App Router)
export const metadata = {
    title: "A+ MovieShop",
    description: "Get your movies here! Compra películas, descubre novedades y ofertas.",
    openGraph: {
        title: "A+ MovieShop",
        description: "Compra películas, descubre novedades y ofertas.",
        url: "https://tu-dominio.com",
        images: [
            {
                url: "https://tu-dominio.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "A+ MovieShop"
            }
        ]
    }
};
import HomeSectionSeparatorResponsive from "@/components/home/HomeSectionSeparatorResponsive";

// Ensure the Home page is rendered server-side on every request
export const dynamic = "force-dynamic";

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ genre?: string }>;
}) {
    const params = await searchParams;
    const selectedGenre = params?.genre ?? null;

    return (
        <div>
            <HomeSectionSeparatorResponsive genre={selectedGenre} />
        </div>
    );
}
