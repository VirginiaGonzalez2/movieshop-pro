/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 14:40:49
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 01:18:19
 *  Description: Registration page.
 */

"use client";

import { RegistrationForm } from "@/app/(auth)/register/_components/RegistrationForm";
import { NoSessionChecker } from "@/components/auth/NoSessionChecker";
import { useOriginRouter } from "@/hooks/use-origin-router";

export default function RegisterPage() {
    const router = useOriginRouter(true);

    return (
        <main className="size-full flex justify-center items-center">
            <NoSessionChecker originUrl={router.getOrigin()}>
                <RegistrationForm className="m-4 flex-1" />
            </NoSessionChecker>
        </main>
    );
}
