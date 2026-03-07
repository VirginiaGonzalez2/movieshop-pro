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
