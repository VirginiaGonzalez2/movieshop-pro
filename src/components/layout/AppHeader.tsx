import Link from "next/link";
import Image from "next/image";
import UserMenuDropdown from "@/components/auth/UserMenuDropdown";
import NavSearch from "@/components/nav/NavSearch";

export default function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-0 pr-6 h-20 sm:h-24 flex items-center justify-between">
        {/* LEFT — LOGO (ALWAYS LINKS TO HOME) */}
        <Link
          href="/"
          className="flex items-center min-h-0 ml-0"
          style={{ height: "100%", marginLeft: 0, paddingLeft: 0 }}
        >
          <div
            className="relative"
            style={{ height: "100%", width: "auto", aspectRatio: "7/2" }}
          >
            <Image
              src="/logo-movieshop.png"
              alt="MovieShop logo"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 240px"
              priority
            />
          </div>
        </Link>

        {/* CENTER — NAVIGATION */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/">Home</Link>
          <Link href="/movies">Movies</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        {/* SEARCH */}
        <NavSearch />

        {/* RIGHT — USER MENU */}
        <UserMenuDropdown />
      </div>
    </header>
  );
}
