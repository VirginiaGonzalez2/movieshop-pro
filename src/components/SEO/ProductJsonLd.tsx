import { NextSeo, ProductJsonLd } from "next-seo";

export function MovieProductJsonLd({ movie }: { movie: any }) {
  return (
    <>
      <NextSeo
        title={movie.title}
        description={movie.description}
        openGraph={{
          title: movie.title,
          description: movie.description,
          images: [{ url: movie.image }],
        }}
      />
      <ProductJsonLd
        productName={movie.title}
        description={movie.description}
        images={[movie.image]}
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
