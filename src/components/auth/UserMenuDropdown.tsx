"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { authClient } from "@/lib/auth-client";
import { isAdminRole } from "@/lib/admin-roles";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
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
    const [isAdmin, setIsAdmin] = useState(false);

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

    useEffect(() => {
        let mounted = true;

        async function loadAdminStatus() {
            if (loginStatus !== "loggedin") {
                if (mounted) {
                    setIsAdmin(false);
                }
                return;
            }

            const roleInSession = session.data?.user.role;
            if (isAdminRole(roleInSession)) {
                if (mounted) {
                    setIsAdmin(true);
                }
                return;
            }

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
    }, [loginStatus, session.data?.user.role]);

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
                        {isAdmin && (
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
