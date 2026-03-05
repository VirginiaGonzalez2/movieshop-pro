/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-12 01:08:49
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 12:35:32
 *  Description: Wrapper component to enforce no current session.
 *               Redireects to 'from' url or / if there is one.
 */

"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
    children: ReactNode;
    originUrl: string;
};

export function NoSessionChecker({ children, originUrl }: Props) {
    const router = useRouter();
    const session = authClient.useSession();

    useEffect(() => {
        if (!session.isPending && !session.isRefetching && session.data) {
            router.replace(originUrl);
        }
    }, [session.isPending, session.isRefetching, session.data, router, originUrl]);

    if (session.isPending || session.isRefetching) {
        // Loading
        return <></>;
    }

    if (session.data) {
        return <></>;
    }

    return <>{children}</>;
}
