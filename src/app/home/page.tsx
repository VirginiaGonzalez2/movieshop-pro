import HomeSectionSeparatorResponsive from "@/components/home/HomeSectionSeparatorResponsive";

export const dynamic = "force-dynamic";

export default async function HomeResponsivePage({
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
