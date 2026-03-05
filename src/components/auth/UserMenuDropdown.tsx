"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent } from "react";
import { Button } from "../ui/button";

type LoginStatus = "pending" | "loggedin" | "notloggedin";

export default function UserMenuDropdown() {
    const pathName = usePathname();

    const isAuthRoute =
        pathName == "/login" ||
        pathName == "/logout" ||
        pathName == "/register" ||
        pathName == "/reset-password";

    const router = useOriginRouter(isAuthRoute);

    const session = authClient.useSession();

    const loginStatus: LoginStatus =
        session.isPending || session.isRefetching
            ? "pending"
            : session.data
              ? "loggedin"
              : "notloggedin";

    function blockWhilePending(event: MouseEvent<HTMLAnchorElement>) {
        if (loginStatus === "pending") {
            event.preventDefault();
        }
    }

    // TODO: Use session data to display name and email profile pic etc.

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    aria-label="User menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:opacity-50 transition" 
                >
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                {loginStatus !== "loggedin" ? (
                    <>
                        <DropdownMenuItem asChild>
                            <Link
                                replace
                                href={router.formatUrl("/login")}
                                onClick={blockWhilePending}
                            >
                                Log In
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                replace
                                href={router.formatUrl("/register")}
                                onClick={blockWhilePending}
                            >
                                Register
                            </Link>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        {session.data?.user.role === "admin" && (
                            <DropdownMenuItem asChild>
                                <Link href={router.formatUrl("/admin")} onClick={blockWhilePending}>
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link
                                replace
                                href={router.formatUrl("/logout")}
                                onClick={blockWhilePending}
                            >
                                Log Out
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
