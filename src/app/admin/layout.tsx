"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = authClient.useSession();

    if (session.isPending || session.isRefetching) {
        return <></>;
    }

    if (!session.data || session.data.user.role !== "admin") {
        redirect("/");
    }

    return <>{children}</>;
}
