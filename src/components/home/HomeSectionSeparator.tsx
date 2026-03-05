import HomeHero from "./HomeHero";
import HomeQuickFilters from "./HomeQuickFilters";
import TopCheapestMoviesSection from "./TopCheapestMoviesSection";
import TopOldestMoviesSection from "./TopOldestMoviesSection";
import TopPurchasedMoviesSection from "./TopPurchasedMoviesSection";
import TopRecentMoviesSection from "./TopRecentMoviesSection";

export default function HomeSectionSeparator({ genre }: { genre?: string | null }) {
    // Log selected genre on server for debugging (helps verify searchParams reach server)
    console.log("HomeSectionSeparator - selected genre:", genre);

    const sectionTitleClass = "text-2xl md:text-3xl font-semibold tracking-tight text-foreground";

    return (
        <div>
            <div className="mx-auto max-w-2xl pt-22 pb-22">
                <HomeHero />
            </div>

            {/* Home quick category navigation section */}
            <HomeQuickFilters />

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <h2 className={sectionTitleClass}>Top 5 Most Recent</h2>
                <div className="mt-6">
                    <TopRecentMoviesSection genre={genre} />
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <h2 className={sectionTitleClass}>Top 5 Most Purchased</h2>
                <div className="mt-6">
                    <TopPurchasedMoviesSection genre={genre} />
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <h2 className={sectionTitleClass}>Top 5 Oldest</h2>
                <div className="mt-6">
                    <TopOldestMoviesSection genre={genre} />
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <h2 className={sectionTitleClass}>Top 5 Cheapest</h2>
                <div className="mt-6">
                    <TopCheapestMoviesSection genre={genre} />
                </div>
            </section>
        </div>
    );
}
