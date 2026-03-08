import { NextSeo } from 'next-seo';

export default function NextSeoExample() {
  return (
    <>
      <NextSeo
        title="Ejemplo NextSeo"
        description="Esta es una página de ejemplo usando NextSeo en Next.js."
        openGraph={{
          title: 'Ejemplo NextSeo',
          description: 'Esta es una página de ejemplo usando NextSeo en Next.js.',
          url: 'https://www.tusitio.com/nextseo-example',
          images: [
            {
              url: 'https://www.tusitio.com/images/og-image.jpg',
              width: 800,
              height: 600,
              alt: 'Ejemplo NextSeo',
            },
          ],
        }}
      />
      <main>
        <h1>Ejemplo NextSeo</h1>
        <p>Esta página muestra cómo usar NextSeo en una página cliente.</p>
      </main>
    </>
  );
}
