import { Suspense } from "react";
import HomeHero from "./HomeHero";
import HomeQuickFilters from "./HomeQuickFilters";
import TopCheapestMoviesSection from "./TopCheapestMoviesSection";
import TopOldestMoviesSection from "./TopOldestMoviesSection";
import TopPurchasedMoviesSection from "./TopPurchasedMoviesSection";
import TopRecentMoviesSection from "./TopRecentMoviesSection";

export default function HomeSectionSeparator({ genre }: { genre?: string | null }) {
    // Log selected genre on server for debugging (helps verify searchParams reach server)
    console.log("HomeSectionSeparator - selected genre:", genre);
    return (
        <div>
            <div className="mx-auto max-w-2xl py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Hero section</h1>
                <p className="mb-2">Browse and buy your favorite movies.</p>
                <HomeHero />
            </div>

            

            

            {/* Home quick category navigation section */}
            <HomeQuickFilters />

            <div className="mb-8">
                <h1 className="text-left text-2xl font-bold mb-4">Top 5 most recent</h1>
                <TopRecentMoviesSection genre={genre} />
            </div>

            <div className="mb-8">
                <h1 className="text-left text-2xl font-bold mb-4">Top 5 most purchased</h1>
                <TopPurchasedMoviesSection genre={genre} />
            </div>

            <div className="mb-8">
                <h1 className="text-left text-2xl font-bold mb-4">Top 5 oldest</h1>
                <TopOldestMoviesSection genre={genre} />
            </div>

            <div className="mb-8">
                <h1 className="text-left text-2xl font-bold mb-4">Top 5 cheapest</h1>
                <TopCheapestMoviesSection genre={genre} />
            </div>

            
        </div>
    );
}
