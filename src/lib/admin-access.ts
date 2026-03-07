import { auth } from "@/lib/auth";
import { type AdminArea, hasAdminArea, isAdminRole } from "@/lib/admin-roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdminArea(area: AdminArea) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !isAdminRole(session.user.role) || !hasAdminArea(session.user.role, area)) {
        redirect("/");
    }

    return session;
}
