import HomeHero from "./HomeHero";
import HomeQuickFiltersResponsive from "./HomeQuickFiltersResponsive";
import TopCheapestMoviesSectionResponsive from "./TopCheapestMoviesSectionResponsive";
import TopOldestMoviesSectionResponsive from "./TopOldestMoviesSectionResponsive";
import TopPurchasedMoviesSectionResponsive from "./TopPurchasedMoviesSectionResponsive";
import TopRecentMoviesSectionResponsive from "./TopRecentMoviesSectionResponsive";

export default function HomeSectionSeparatorResponsive({ genre }: { genre?: string | null }) {
    const sectionTitleClass = "text-2xl md:text-3xl font-semibold tracking-tight text-foreground";
    const sectionClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 border-b last:border-b-0";

    return (
        <div>
            <HomeHero />

            <HomeQuickFiltersResponsive genre={genre} />

            <section className={sectionClass}>
                <h2 className={sectionTitleClass}>Top 4 Most Recent</h2>
                <div className="mt-6 rounded-xl border bg-card/40 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                    <TopRecentMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={sectionTitleClass}>Top 4 Most Purchased</h2>
                <div className="mt-6 rounded-xl border bg-card/40 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                    <TopPurchasedMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={sectionTitleClass}>Top 4 Oldest</h2>
                <div className="mt-6 rounded-xl border bg-card/40 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                    <TopOldestMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={sectionTitleClass}>Top 4 Cheapest</h2>
                <div className="mt-6 rounded-xl border bg-card/40 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
                    <TopCheapestMoviesSectionResponsive genre={genre} />
                </div>
            </section>
        </div>
    );
}
