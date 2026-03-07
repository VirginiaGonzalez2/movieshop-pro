import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin-rbac";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const isAdmin = isAdminRole(session?.user?.role);
        return NextResponse.json({ isAdmin });
    } catch {
        return NextResponse.json({ isAdmin: false }, { status: 200 });
    }
}
