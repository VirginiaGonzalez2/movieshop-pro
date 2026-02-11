/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 09:21:53
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-11 11:05:56
 *  Description: Login page.
 */

"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/LoginForm";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }

    return (
        <div className="w-full flex justify-center">
            <LoginForm className="m-10 flex-1" />
        </div>
    );
}
