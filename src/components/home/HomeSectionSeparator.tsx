import HomeHero from "./HomeHero";
import TopCheapestMoviesSection from "./TopCheapestMoviesSection";
import TopOldestMoviesSection from "./TopOldestMoviesSection";
import TopPurchasedMoviesSection from "./TopPurchasedMoviesSection";
import TopRecentMoviesSection from "./TopRecentMoviesSection";

export default function HomeSectionSeparator()
{
  return (
    <div>
      <div className="mx-auto max-w-2xl py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Hero section</h1>     
        <p className="mb-2">Browse and buy your favorite movies.</p>
        <HomeHero />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Horizontal button rows</h1>
      </div>
      <div>
        <h1 className="text-left text-2xl font-bold mb-4">Top 5 most recent</h1>
        <TopRecentMoviesSection />
      </div>
      <div>
        <h1 className="text-left text-2xl font-bold mb-4">Top 5 most purchased</h1>
        <TopPurchasedMoviesSection />
      </div>
      <div>
        <h1 className="text-left text-2xl font-bold mb-4">Top 5 oldest</h1>
        <TopOldestMoviesSection />
      </div>
      <div>
          <h1 className="text-left text-2xl font-bold mb-4">Top 5 cheapest</h1>
          <TopCheapestMoviesSection />
      </div>
      <div className="columns-2 border">
        <div>
          <h1 className="text-2xl font-bold mb-4">Deal of the day</h1>
          {/* <Deal_of_the_day /> */}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">Browse by genre</h1>
        </div>
      </div>
    </div>
  );
}