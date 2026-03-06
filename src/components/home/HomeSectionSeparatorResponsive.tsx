import HomeHero from "./HomeHero";
import HomeQuickFiltersResponsive from "./HomeQuickFiltersResponsive";
import TopCheapestMoviesSectionResponsive from "./TopCheapestMoviesSectionResponsive";
import TopOldestMoviesSectionResponsive from "./TopOldestMoviesSectionResponsive";
import TopPurchasedMoviesSectionResponsive from "./TopPurchasedMoviesSectionResponsive";
import TopRecentMoviesSectionResponsive from "./TopRecentMoviesSectionResponsive";

export default function HomeSectionSeparatorResponsive({ genre }: { genre?: string | null }) {
    const sectionTitleClass = "text-2xl md:text-3xl font-semibold tracking-tight text-foreground";
    const sectionClass = "w-full py-8 md:py-10 border-b last:border-b-0";

    return (
        <div>
            <div className="mx-auto max-w-2xl py-0">
                <HomeHero />
            </div>

            <HomeQuickFiltersResponsive genre={genre} />

            <section className={sectionClass}>
                <h2 className={`${sectionTitleClass} px-4 sm:px-6 lg:px-8`}>Top 4 Most Recent</h2>
                <div className="mt-6 rounded-xl bg-card/40 py-3 sm:py-4 md:py-5">
                    <TopRecentMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={`${sectionTitleClass} px-4 sm:px-6 lg:px-8`}>Top 4 Most Purchased</h2>
                <div className="mt-6 rounded-xl bg-card/40 py-3 sm:py-4 md:py-5">
                    <TopPurchasedMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={`${sectionTitleClass} px-4 sm:px-6 lg:px-8`}>Top 4 Oldest</h2>
                <div className="mt-6 rounded-xl bg-card/40 py-3 sm:py-4 md:py-5">
                    <TopOldestMoviesSectionResponsive genre={genre} />
                </div>
            </section>

            <section className={sectionClass}>
                <h2 className={`${sectionTitleClass} px-4 sm:px-6 lg:px-8`}>Top 4 Cheapest</h2>
                <div className="mt-6 rounded-xl bg-card/40 py-3 sm:py-4 md:py-5">
                    <TopCheapestMoviesSectionResponsive genre={genre} />
                </div>
            </section>
        </div>
    );
}
