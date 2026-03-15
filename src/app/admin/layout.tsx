import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Removed auth and admin-roles dependencies

const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/movies", label: "Movies" },
    { href: "/admin/discount-codes", label: "Discount Codes" },
    { href: "/admin/genres", label: "Genres" },
    { href: "/admin/people", label: "People" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/contact-messages", label: "Messages" },
    { href: "/admin/users", label: "Admin Users" },
    { href: "/admin/integrations", label: "Integrations" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    // Lógica de protección admin usando Better Auth
    // import { authClient } from "@/lib/auth-client";
    // const session = authClient.useSession();
    // if (!session.data || session.data.role !== "admin") {
    //     redirect("/");
    //     return null;
    // }
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
                </div>
                <nav className="mt-4 flex flex-wrap justify-center gap-2">
                    {navItems.map((item) => (
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
};

export default AdminLayout;
