import HomeSectionSeparator from "@/components/home/HomeSectionSeparator";

// Ensure the Home page is rendered server-side on every request
export const dynamic = "force-dynamic";

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ genre?: string }>;
}) {
    // IMPORTANT: unwrap searchParams in Next 16
    const params = await searchParams;

    const selectedGenre = params?.genre ?? null;

    console.log("HOME PAGE GENRE:", selectedGenre);

    return (
        <div>
            <HomeSectionSeparator genre={selectedGenre} />
        </div>
    );
}
