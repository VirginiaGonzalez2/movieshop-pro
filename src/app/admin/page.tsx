import Link from "next/link";
import { Film, Tags, Users, ArrowRight, ReceiptText, Mail, ShieldCheck, Percent, Megaphone, BarChart2 } from "lucide-react";
import { AdminArea, getAreasForRole, requireAdminArea } from "@/lib/admin-rbac";

const cards = [
    {
        title: "Movies",
        description: "Create, edit, and manage the movie catalog.",
        href: "/admin/movies",
        icon: Film,
        area: "movies" as AdminArea,
    },
    {
        title: "Discount Codes",
        description: "Create timed promo and discount codes for full catalog or selected products.",
        href: "/admin/discount-codes",
        icon: Percent,
        area: "discounts" as AdminArea,
    },
    {
        title: "Genres",
        description: "Manage genre categories used for filtering.",
        href: "/admin/genres",
        icon: Tags,
        area: "genres" as AdminArea,
    },
    {
        title: "People",
        description: "Manage actors and directors linked to movies.",
        href: "/admin/people",
        icon: Users,
        area: "people" as AdminArea,
    },
    {
        title: "Orders",
        description: "Track customer orders and update their status.",
        href: "/admin/orders",
        icon: ReceiptText,
        area: "orders" as AdminArea,
    },
    {
        title: "Contact Messages",
        description: "Review and manage incoming customer messages.",
        href: "/admin/contact-messages",
        icon: Mail,
        area: "messages" as AdminArea,
    },
    {
        title: "Admin Users",
        description: "Grant and control role-based access for admin teams.",
        href: "/admin/users",
        icon: ShieldCheck,
        area: "users" as AdminArea,
    },
    {
        title: "Analítica & GTM",
        description: "Conecta y visualiza Google Analytics y Tag Manager.",
        href: "/admin/analytics",
        icon: require("lucide-react").BarChart2,
        area: "overview" as AdminArea,
    },
    {
        title: "Promo Bar",
        description: "Edit, schedule, and customize the promotional bar for your site. Choose text, color, pages, and duration.",
        href: "/admin/promobar",
        icon: Megaphone,
        area: "promo" as AdminArea,
    },
];

export default async function AdminPage() {
    const session = await requireAdminArea("overview");
    const allowedAreas = new Set(getAreasForRole(session.user.role));
    const visibleCards = cards.filter((card) => allowedAreas.has(card.area));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Dashboard Overview</h2>
                <p className="text-sm text-muted-foreground">
                    Choose a workspace to manage storefront content and operations.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="group rounded-xl border bg-card p-5 transition hover:bg-muted/30"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg border bg-background flex items-center justify-center">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{c.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {c.description}
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
