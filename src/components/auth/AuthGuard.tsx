"use client";

import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";

type Props = {
    children: ReactNode;
    /**
     * Optional custom redirect path if we ever need it.
     * Default is login.
     */
    redirectTo?: string;
};

export function AuthGuard({ children, redirectTo = "/login" }: Props) {
    const originRouter = useOriginRouter();
    const router = useRouter();
    const session = authClient.useSession();
    const redirectUrl = useMemo(
        () => originRouter.formatUrl(redirectTo),
        [originRouter, redirectTo],
    );

    useEffect(() => {
        if (!session.isPending && !session.isRefetching && !session.data) {
            router.replace(redirectUrl);
        }
    }, [session.isPending, session.isRefetching, session.data, router, redirectUrl]);

    // While session is loading, render nothing
    if (session.isPending || session.isRefetching) {
        return <></>;
    }

    // Not logged-in: redirect happens in useEffect
    if (!session.data) {
        return <></>;
    }

    // Logged-in render page
    return <>{children}</>;
}
