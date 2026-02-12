"use client";

import Link from "next/link";
import { User } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { usePathname } from "next/navigation";

export default function UserMenuDropdown() {
    const pathName = usePathname();

    const isAuthRoute =
        pathName == "/login" ||
        pathName == "/logout" ||
        pathName == "/register" ||
        pathName == "/reset-password";

    const router = useOriginRouter(isAuthRoute);

    // 🔴 Temporary state (will be replaced with real auth later)
    const isAuthenticated = false;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="User menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition">
                    <User className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                {/* 🔹 Temporary UI: show all options */}
                <DropdownMenuItem asChild>
                    <Link href={router.formatUrl("/login")}>Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={router.formatUrl("/register")}>Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={router.formatUrl("/logout")}>Logout</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
