export default function ContactPage() {
    return (
        <div className="mx-auto max-w-2xl py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">Contact</h1>
            <p className="mb-2">You can reach us at:</p>
            <ul className="mb-4 list-disc list-inside">
                <li>
                    Email:{" "}
                    <a href="mailto:support@movieshop.com" className="text-primary underline">
                        support@movieshop.com
                    </a>
                </li>
                <li>
                    Phone:{" "}
                    <a href="tel:+1234567890" className="text-primary underline">
                        +1 234 567 890
                    </a>
                </li>
            </ul>
            <p>We will get back to you as soon as possible!</p>
        </div>
    );
}
