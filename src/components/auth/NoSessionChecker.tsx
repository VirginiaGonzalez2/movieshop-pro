/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-12 01:08:49
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 01:18:45
 *  Description: Wrapper component to enforce no current session.
 */

"use server";

import { auth } from "@/lib/auth";
import { Url } from "next/dist/shared/lib/router/router";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    originUrl: Url;
};

export async function NoSessionChecker({ children, originUrl }: Props) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect(originUrl.toString());
    }

    return children;
}
