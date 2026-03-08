// SEO metadata for Contact Us page
export const metadata = {
    title: "Contact Us - A+ MovieShop",
    description: "Contact our team for any questions or support needs.",
    openGraph: {
        title: "Contact Us - A+ MovieShop",
        description: "Contact our team for any questions or support needs.",
        url: "https://tu-dominio.com/contact-us",
        images: [
            {
                url: "https://tu-dominio.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "A+ MovieShop"
            }
        ]
    }
};
export default function ContactUs() {
    return (
        <div className="mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
            <p>Contact our team for any questions or support needs.</p>
        </div>
    );
}
