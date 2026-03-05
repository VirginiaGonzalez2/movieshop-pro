/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-12 13:17:01
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 16:06:59
 *  Description: Logout page.
 */

"use client";

import { Button } from "@/components/ui/button";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Status = "processing" | "success" | "fail";

export default function LogoutPage() {
    const router = useOriginRouter(true);
    const session = authClient.useSession();
    const [status, setStatus] = useState<Status>("processing");
    const hasRequestedSignOut = useRef(false);

    useEffect(() => {
        if (status !== "processing") return;

        if (!session.data) {
            router.returnToOrigin();
            return;
        }

        if (hasRequestedSignOut.current) return;
        hasRequestedSignOut.current = true;

        authClient
            .signOut()
            .then((response) => {
                setStatus(response.data?.success ? "success" : "fail");
            })
            .catch((error) => {
                setStatus("fail");
                console.log(error);
            });
    }, [router, session.data, status]);

    function getStatusMessage(status: Status) {
        switch (status) {
            case "success":
                return "You have been successfully logged out!";
            case "fail":
                return "Something went wrong and you may not have been logged out!";
            default:
                return "";
        }
    }

    return (
        <>
            {status !== "processing" && (
                <main className="size-full flex justify-center items-center">
                    <div className="gap-8 flex-1 flex flex-col">
                        <p className="text-3xl">{getStatusMessage(status)}</p>
                        <Button asChild variant="link" className="text-xl text-link-primary">
                            <Link href={router.getOrigin()}>
                                Click here to return to your last visited page
                            </Link>
                        </Button>
                    </div>
                </main>
            )}
        </>
    );
}
