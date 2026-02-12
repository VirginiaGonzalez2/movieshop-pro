import Image from "next/image";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t bg-muted text-sm">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* LOGO */}
        <div className="space-y-3">
          <div className="flex items-start">
            <Link href="/">
              <Image
                src="/logo-movieshop.png"
                alt="MovieShop logo"
                width={96}
                height={96}
                style={{ height: "96px", width: "auto" }}
                priority
              />
            </Link>
          </div>
          <p className="text-muted-foreground">
            Your digital destination for movies.
          </p>
        </div>

        {/* CUSTOMER HELP */}
        <div>
          <h3 className="font-semibold mb-3">Customer Help</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/help-center">Help Center</Link>
            </li>
            <li>
              <Link href="/returns-refunds">Returns & Refunds</Link>
            </li>
            <li>
              <Link href="/buying-guide">Buying Guide</Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/gdpr-privacy">GDPR & Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-conditions">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link href="/customer-support">Customer Support</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t text-center py-4 text-muted-foreground">
        © 2026 MovieShop. All rights reserved.
      </div>
    </footer>
  );
}
