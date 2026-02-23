import ContactForm from "./ContactForm";
/*
  Contact Page Layout

  - Left side: company information (left-aligned)
  - Right side: contact form
  - No global layout changes
*/

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-16 md:grid-cols-2">
                {/* LEFT SIDE — Information */}
                <div className="flex flex-col justify-center space-y-6 text-left">
                    <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>

                    <p className="text-lg text-muted-foreground">
                        Have a question about your order or our movies? We’re happy to help.
                    </p>

                    <div className="space-y-6 pt-8">
                        <div>
                            <p className="text-sm font-semibold uppercase text-muted-foreground">
                                Email
                            </p>
                            <p className="text-lg font-medium">support@movieshop.com</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase text-muted-foreground">
                                Phone
                            </p>
                            <p className="text-lg font-medium">+1 234 567 890</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase text-muted-foreground">
                                Response Time
                            </p>
                            <p className="text-lg font-medium">Within 24 hours</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — Form */}
                <ContactForm />
            </div>
        </div>
    );
}
