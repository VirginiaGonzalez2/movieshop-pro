import {
    grantAdminRoleByEmail,
    revokeAdminRole,
    updateAdminUserRole,
} from "@/actions/admin-users";
import { adminRoleAreas, adminRoleLabels, requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams?: Promise<{ error?: string; success?: string }> | { error?: string; success?: string };
}) {
    const session = await requireAdminArea("users");
    const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
    const errorMessage = resolvedSearchParams.error?.trim() || "";
    const successMessage = resolvedSearchParams.success?.trim() || "";

    const adminRoleOptions = Object.entries(adminRoleLabels).map(([value, label]) => ({
        value,
        label,
    }));

    const adminUsers = await prisma.user.findMany({
        where: { role: { in: Object.keys(adminRoleAreas) } },
        orderBy: [{ role: "asc" }, { email: "asc" }],
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold">Admin Users</h2>
                <p className="text-sm text-muted-foreground">
                    Assign full-access or area-specific admin roles for ecommerce operations.
                </p>
            </div>

            {errorMessage ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                </div>
            ) : null}

            <section className="rounded-lg border bg-card p-4 sm:p-5 space-y-4">
                <div>
                    <h3 className="font-semibold">Grant Admin Access</h3>
                    <p className="text-sm text-muted-foreground">
                        Promote an existing user by email and select the admin scope.
                    </p>
                </div>

                <form
                    action={grantAdminRoleByEmail}
                    className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto] md:items-end"
                >
                    <div className="space-y-1">
                        <label className="text-sm font-medium">User Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="user@example.com"
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Admin Role</label>
                        <select
                            name="role"
                            defaultValue="catalog_admin"
                            className="w-full border rounded-md p-2 bg-background"
                        >
                            {adminRoleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm w-full md:w-auto"
                    >
                        Grant Access
                    </button>
                </form>
            </section>

            <section className="rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground">
                    <span>Current Admin Users</span>
                    <span>{adminUsers.length}</span>
                </div>

                {adminUsers.length === 0 ? (
                    <div className="p-6 text-sm text-muted-foreground">No admin users configured yet.</div>
                ) : (
                    <div className="divide-y">
                        {adminUsers.map((user) => {
                            const roleKey = user.role.toLowerCase();
                            const roleLabel = adminRoleLabels[roleKey] ?? user.role;
                            const areas = adminRoleAreas[roleKey] ?? [];
                            const isSelf = session.user.id === user.id;

                            return (
                                <div key={user.id} className="p-4 sm:p-5 space-y-3">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                        <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                                            {roleLabel}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {areas.map((area) => (
                                            <span
                                                key={`${user.id}-${area}`}
                                                className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <form
                                            action={updateAdminUserRole.bind(null, user.id)}
                                            className="flex w-full sm:w-auto flex-wrap items-center gap-2"
                                        >
                                            <select
                                                name="role"
                                                defaultValue={roleKey}
                                                className="border rounded-md px-2 py-1.5 text-sm bg-background w-full sm:w-auto"
                                            >
                                                {adminRoleOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted w-full sm:w-auto"
                                            >
                                                Update Role
                                            </button>
                                        </form>

                                        <form action={revokeAdminRole.bind(null, user.id)}>
                                            <button
                                                type="submit"
                                                disabled={isSelf}
                                                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                Remove Admin
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
