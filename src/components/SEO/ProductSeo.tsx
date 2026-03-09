"use client";
import NextSeo from "next-seo";
import { ProductJsonLd } from "next-seo";

// SEO component for product/movie detail pages
export type Movie = {
  title: string;
  description: string;
  image: string;
  price: number;
  director: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
};

export function ProductSeo({ movie }: { movie: Movie }) {
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
        brand={movie.director}
      />
    </>
  );
}
