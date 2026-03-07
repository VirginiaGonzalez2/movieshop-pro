import { auth } from "@/lib/auth";
import { AdminArea, hasAdminArea, isAdminRole } from "@/lib/admin-roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export { type AdminArea } from "@/lib/admin-roles";
export { adminRoleAreas, adminRoleLabels, getAreasForRole, isAdminRole, normalizeUserRole } from "@/lib/admin-roles";

export async function requireAdminArea(area: AdminArea) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !isAdminRole(session.user.role) || !hasAdminArea(session.user.role, area)) {
        redirect("/");
    }

    return session;
}
