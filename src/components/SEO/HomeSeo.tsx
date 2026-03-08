"use client";
import { NextSeo } from "next-seo";

export function HomeSeo() {
  return (
    <NextSeo
      title="A+ MovieShop"
      description="Get your movies here! Compra películas, descubre novedades y ofertas."
      openGraph={{
        type: "website",
        locale: "es_ES",
        url: "https://tu-dominio.com",
        site_name: "A+ MovieShop",
        title: "A+ MovieShop",
        description: "Compra películas, descubre novedades y ofertas.",
        images: [
          {
            url: "https://tu-dominio.com/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "A+ MovieShop"
          }
        ]
      }}
      twitter={{
        handle: "@MovieShop",
        site: "@MovieShop",
        cardType: "summary_large_image"
      }}
    />
  );
}
