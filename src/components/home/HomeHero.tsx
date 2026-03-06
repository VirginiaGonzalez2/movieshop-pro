import { getDealMovie, getDealSelection } from "@/actions/deal-of-the-day";
import { addShoppingCartItem } from "@/actions/shopping-cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";

export default async function HomeHero()
{
  const deal = await getDealMovie();
  const dealId = await getDealSelection();

  const heroFilename = deal?.imageUrl
    ?.split("/")
    .pop()
    ?.replace(/(\.[a-zA-Z]+)$/, "_hero$1");

  const wideHeroImage = heroFilename ? `/images/movies-wide/${heroFilename}` : null;
  const wideHeroFilePath = heroFilename
    ? path.join(process.cwd(), "public", "images", "movies-wide", heroFilename)
    : null;

  const heroImage =
    wideHeroImage && wideHeroFilePath && existsSync(wideHeroFilePath)
      ? wideHeroImage
      : (deal?.imageUrl ?? null);

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
      <div className="relative mx-auto w-full max-w-[1920px] aspect-[96/35] bg-muted">
        {/* Image container with all overlays positioned relative to it */}
        {heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={deal?.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 z-30 flex items-center justify-center px-4">
          <div className="text-center space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
            Checkout Our Deals of the Day
          </h1>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
            {deal?.title ?? "Today’s Featured Deal"}
          </h2>

          {dealId?.movieId && (
            <div className="flex justify-center gap-3">
              <Button
                asChild
                className="bg-white/90 rounded text-foreground text-lg md:text-xl"
                variant="secondary"
              >
                <Link href={`/movies/${dealId.movieId}`}>View</Link>
              </Button>

              <form action={addAndRedirect}>
                <Button
                  className="bg-white/90 rounded text-foreground text-lg md:text-xl"
                  variant="secondary"
                >
                  Add to Cart
                </Button>
              </form>
            </div>
          )}

          <h3 className="text-lg md:text-2xl font-medium tracking-wide text-white drop-shadow-lg">
            High Quality Movies
          </h3>
          </div>
        </div>
      </div>
    </div>
  );
}