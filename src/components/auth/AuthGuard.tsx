"use client";

import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    /**
     * Optional custom redirect path if we ever need it.
     * Default is login.
     */
    redirectTo?: string;
};

export function AuthGuard({ children, redirectTo = "/login" }: Props) {
    const router = useOriginRouter();
    const session = authClient.useSession();

    // While session is loading, render nothing
    if (session.isPending || session.isRefetching) {
        return <></>;
    }

    // Not logged-in go to login
    if (!session.data) {
        redirect(router.formatUrl(redirectTo));
    }

    // Logged-in render page
    return <>{children}</>;
}
