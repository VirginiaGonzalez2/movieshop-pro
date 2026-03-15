/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-12 01:08:49
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 12:35:32
 *  Description: Wrapper component to enforce no current session.
 *               Redireects to 'from' url or / if there is one.
 */

"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    children: ReactNode;
    originUrl: string;
};

const NoSessionChecker = ({ children, originUrl }: Props) => {
    const router = useRouter();
    const [hasSession, setHasSession] = React.useState(false);

    React.useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            setHasSession(true);
            router.replace(originUrl);
        } else {
            setHasSession(false);
        }
    }, [router, originUrl]);

    if (hasSession) {
        return null;
    }
    return <>{children}</>;
};

export { NoSessionChecker };
