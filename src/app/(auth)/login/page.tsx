/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 09:21:53
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 01:18:22
 *  Description: Login page.
 */

"use client";

import { NoSessionChecker } from "@/components/auth/NoSessionChecker";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
    const router = useOriginRouter(true);

    return (
        <main className="size-full flex justify-center items-center">
            <NoSessionChecker originUrl={router.getOrigin()}>
                <LoginForm className="m-4  flex-1" />
            </NoSessionChecker>
        </main>
    );
}
