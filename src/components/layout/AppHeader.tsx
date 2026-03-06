"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";

import NavSearch from "@/components/nav/NavSearch";

//  Client-only to avoid Radix hydration mismatch
const UserMenuDropdown = dynamic(() => import("@/components/auth/UserMenuDropdown"), {
    ssr: false,
});

/**
 * Responsive Application Header
 *
 * Features:
 * - Desktop navigation (unchanged)
 * - Mobile burger menu
 * - Clean slide-down mobile panel
 * - Keeps NavSearch + UserMenuDropdown
 * - Professional responsive layout
 */
export default function AppHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadAdminStatus() {
            try {
                const response = await fetch("/api/auth/is-admin", { cache: "no-store" });

                if (!response.ok) {
                    if (mounted) {
                        setIsAdmin(false);
                    }
                    return;
                }

                const data = (await response.json()) as { isAdmin?: boolean };
                if (mounted) {
                    setIsAdmin(Boolean(data.isAdmin));
                }
            } catch {
                if (mounted) {
                    setIsAdmin(false);
                }
            }
        }

        loadAdminStatus();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <header className="border-b bg-background relative z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
                {/* LEFT — LOGO */}
                <Link href="/" className="flex items-center min-h-0" style={{ height: "100%" }}>
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

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/home">Home Responsive</Link>
                    <Link href="/movies">Movies</Link>
                    <Link href="/orders">Orders</Link>
                    <Link href="/cart">Cart</Link>
                    <Link href="/contact">Contact</Link>
                    {isAdmin && <Link href="/admin">Admin</Link>}
                </nav>

                {/* RIGHT SIDE (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <NavSearch />
                    <UserMenuDropdown />
                </div>

                {/* MOBILE RIGHT SIDE */}
                <div className="flex items-center gap-3 md:hidden">
                    <UserMenuDropdown />

                    {/* Burger Button */}
                    <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU PANEL */}
            {isOpen && (
                <div className="md:hidden border-t bg-background shadow-lg animate-in fade-in slide-in-from-top duration-200">
                    <div className="px-6 py-6 flex flex-col gap-5 text-base font-medium">
                        {/* Mobile Navigation Links */}
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>

                        <Link href="/home" onClick={() => setIsOpen(false)}>
                            Home Responsive
                        </Link>

                        <Link href="/movies" onClick={() => setIsOpen(false)}>
                            Movies
                        </Link>

                        <Link href="/orders" onClick={() => setIsOpen(false)}>
                            Orders
                        </Link>

                        <Link href="/cart" onClick={() => setIsOpen(false)}>
                            Cart
                        </Link>

                        <Link href="/contact" onClick={() => setIsOpen(false)}>
                            Contact
                        </Link>

                        {isAdmin && (
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                                Admin
                            </Link>
                        )}

                        {/* Mobile Search */}
                        <div className="pt-2">
                            <NavSearch />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
