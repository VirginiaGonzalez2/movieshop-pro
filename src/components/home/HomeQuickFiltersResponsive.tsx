import Link from "next/link";

export default function HomeQuickFiltersResponsive({ genre }: { genre?: string | null }) {
    const selectedGenre = genre?.toLowerCase() ?? null;
    const categories = ["Action", "Drama", "Comedy", "Animation", "Sci-Fi", "Fantasy"];

    return (
        <section className="w-full border-y bg-gray-50 py-8 md:py-12">
            <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-2 text-2xl font-semibold">Browse by Category</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    Discover movies by your favorite genres or explore advanced filters.
                </p>

                <div className="flex justify-center">
                    <nav className="inline-flex flex-wrap justify-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
                        {categories.map((category) => {
                            const isActive = selectedGenre === category.toLowerCase();

                            return (
                                <Link
                                    key={category}
                                    href={`/home?genre=${encodeURIComponent(category)}`}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`rounded-md border px-3 py-1 text-sm font-medium transition ${
                                        isActive
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                    <Link href="/home" className="text-sm text-gray-600 hover:underline">
                        Clear filters
                    </Link>
                    <Link href="/movies" className="font-medium text-blue-600 hover:underline">
                        Explore Advanced Filters →
                    </Link>
                </div>
            </div>
        </section>
    );
}
