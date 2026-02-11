/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 14:40:49
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-11 11:46:55
 *  Description: Registration page.
 */

"use server";

import { RegistrationForm } from "@/app/(auth)/register/_components/RegistrationForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }

    return (
        <div className="w-full flex justify-center">
            <RegistrationForm className="m-10 flex-1" />
        </div>
    );
}
