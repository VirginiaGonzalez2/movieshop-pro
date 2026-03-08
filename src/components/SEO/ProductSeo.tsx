"use client";
import { NextSeo, ProductJsonLd } from "next-seo";

// SEO component for product/movie detail pages
export function ProductSeo({ movie }) {
  return (
    <>
      <NextSeo
        title={movie.seoTitle || movie.title}
        description={movie.seoDescription || movie.description}
        openGraph={{
          title: movie.seoTitle || movie.title,
          description: movie.seoDescription || movie.description,
          images: [{ url: movie.seoImage || movie.image }],
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
        brand={movie.director}
      />
    </>
  );
}
