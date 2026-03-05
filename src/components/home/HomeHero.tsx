import { getDealMovie, getDealSelection } from "@/actions/deal-of-the-day";
import { addShoppingCartItem } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomeHero()
{
  const deal = await getDealMovie();
  const dealId = await getDealSelection();

  const heroImage = deal?.imageUrl
    ? `/images/movies-wide/${
        deal.imageUrl
          .split("/")
          .pop()
          ?.replace(/(\.[a-zA-Z]+)$/, "_hero$1")
      }`
    : null;

  console.log("HERO image", heroImage);

  async function addAndRedirect()
  {
    "use server";
    
    if (!dealId?.movieId) {
      throw new Error("Missing Id for Addto Cart");
    }
    await addShoppingCartItem(dealId?.movieId);
    redirect("/cart"); }

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      {/* Image container with all overlays positioned relative to it */}
      {heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImage}
          alt={deal?.title}
          className="relative w-full h-auto scale-95 -my-2"
          loading="lazy"
        />
      )}

      {/* Top left: "Check out our Deals of the Day" */}
      <div className="absolute top-16 left-26 z-30">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-left">
          Check out our<br />Deals of the Day
        </h1>
      </div>

      {/* Center top: Deal title */}
      <div className="absolute top-16  left-1/2 -translate-x-1/2 z-30 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          {deal?.title}
        </h1>
      </div>

      {/* Center bottom: "High Quality Movies" */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 text-center">
        <h2 className="text-lg md:text-2xl text-white drop-shadow-lg">
          High Quality Movies
        </h2>
      </div>

      {/* Buttons container - positioned above "High Quality Movies" */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-25 flex gap-3">
        {/* View button */}
        <Button
          asChild
          className="bg-white/90 rounded text-foreground text-lg md:text-xl"
          variant="secondary"
        >
          <Link href={`/movies/${dealId?.movieId}`}>View</Link>
        </Button>

        {/* Add to Cart button */}
        <form action={addAndRedirect}>
          <Button
            className="bg-white/90 rounded text-foreground text-lg md:text-xl"
            variant="secondary"
          >
            Add to Cart
          </Button>
        </form>
      </div>
    </div>
  );
}