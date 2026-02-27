import Link from "next/link";
import { Film, Tags, Users, ArrowRight } from "lucide-react";

const cards = [
    {
        title: "Movies",
        description: "Create, edit, and manage the movie catalog.",
        href: "/admin/movies",
        icon: Film,
    },
    {
        title: "Genres",
        description: "Manage genre categories used for filtering.",
        href: "/admin/genres",
        icon: Tags,
    },
    {
        title: "People",
        description: "Manage actors and directors linked to movies.",
        href: "/admin/people",
        icon: Users,
    },
];

export default function AdminPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Quick access to manage movies, genres, and people.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="group border rounded-xl p-5 hover:shadow-md transition bg-background"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg border flex items-center justify-center">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{c.title}</div>
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
