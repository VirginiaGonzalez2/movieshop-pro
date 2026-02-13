/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-10 15:05:25
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 15:50:41
 *  Description: Reset password page.
 */

"use client";

import { NoSessionChecker } from "@/components/auth/NoSessionChecker";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
    const router = useOriginRouter(true);

    return (
        <main className="size-full flex justify-center items-center">
            <NoSessionChecker originUrl={router.getOrigin()}>
                <ResetPasswordForm className="m-4 flex-1" />
            </NoSessionChecker>
        </main>
    );
}
