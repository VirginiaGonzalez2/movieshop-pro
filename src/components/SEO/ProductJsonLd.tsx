import NextSeo from "next-seo";
import { ProductJsonLd } from "next-seo";

export function MovieProductJsonLd({ movie }: { movie: any }) {
  return (
    <>
      {/* SEO meta tags logic removed. Use ProductJsonLd only. */}
      <ProductJsonLd
        name={movie.title}
        description={movie.description}
        image={movie.image}
        offers={{
          price: movie.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }}
        brand={movie.director || ""}
      />
    </>
  );
}
