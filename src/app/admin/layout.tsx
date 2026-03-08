import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type AdminArea, getAreasForRole, isAdminRole } from "@/lib/admin-roles";

const navItems = [
    { href: "/admin", label: "Overview", area: "overview" as AdminArea },
    { href: "/admin/movies", label: "Movies", area: "movies" as AdminArea },
    { href: "/admin/discount-codes", label: "Discount Codes", area: "discounts" as AdminArea },
    { href: "/admin/genres", label: "Genres", area: "genres" as AdminArea },
    { href: "/admin/people", label: "People", area: "people" as AdminArea },
    { href: "/admin/orders", label: "Orders", area: "orders" as AdminArea },
    { href: "/admin/contact-messages", label: "Messages", area: "messages" as AdminArea },
    { href: "/admin/users", label: "Admin Users", area: "users" as AdminArea },
    { href: "/admin/integrations", label: "Integrations", area: "integrations" as AdminArea },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !isAdminRole(session.user.role)) {
        redirect("/");
    }

    const allowedAreas = new Set(getAreasForRole(session.user.role));
    const visibleNavItems = navItems.filter((item) => allowedAreas.has(item.area));

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
            <section className="rounded-xl border bg-card p-4 sm:p-5">
                <div className="flex flex-col items-center text-center gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">Admin Panel</h1>
                        <p className="text-sm text-muted-foreground">
                            Professional control center for catalog, orders, and customer data.
                        </p>
                    </div>

                    <div className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                        {session.user.email}
                    </div>
                </div>

                <nav className="mt-4 flex flex-wrap justify-center gap-2">
                    {visibleNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-md border px-3 py-1.5 text-sm transition hover:bg-muted"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </section>

            {children}
        </div>
    );
}
