"use server";

import { adminRoleAreas, normalizeUserRole, requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function isValidAdminRole(role: string): role is keyof typeof adminRoleAreas {
    return role in adminRoleAreas;
}

function revalidateAdminUserPaths() {
    revalidatePath("/admin");
    revalidatePath("/admin/users");
}

function redirectWithError(message: string): never {
    redirect(`/admin/users?error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(message: string): never {
    redirect(`/admin/users?success=${encodeURIComponent(message)}`);
}

export async function grantAdminRoleByEmail(formData: FormData): Promise<void> {
    await requireAdminArea("users");

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const rawRole = normalizeUserRole(String(formData.get("role") ?? ""));

    if (!email) {
        redirectWithError("Email is required");
    }

    if (!isValidAdminRole(rawRole)) {
        redirectWithError("Invalid admin role");
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) {
        redirectWithError("User with this email does not exist");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { role: rawRole },
    });

    revalidateAdminUserPaths();
    redirectWithSuccess("Admin role granted successfully");
}

export async function updateAdminUserRole(userId: string, formData: FormData): Promise<void> {
    const session = await requireAdminArea("users");

    const rawRole = normalizeUserRole(String(formData.get("role") ?? ""));
    if (!isValidAdminRole(rawRole)) {
        redirectWithError("Invalid admin role");
    }

    if (session.user.id === userId && rawRole !== "admin") {
        redirectWithError("You cannot downgrade your own Super Admin role");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: rawRole },
    });

    revalidateAdminUserPaths();
    redirectWithSuccess("Admin role updated successfully");
}

export async function revokeAdminRole(userId: string): Promise<void> {
    const session = await requireAdminArea("users");

    if (session.user.id === userId) {
        redirectWithError("You cannot remove your own admin access");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: "user" },
    });

    revalidateAdminUserPaths();
    redirectWithSuccess("Admin access removed successfully");
}
