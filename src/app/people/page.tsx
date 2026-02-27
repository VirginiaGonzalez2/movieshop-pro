import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { User, Clapperboard } from "lucide-react";

export default async function PeoplePage() {
    const [actors, directors] = await Promise.all([
        prisma.person.findMany({
            where: { movies: { some: { role: "ACTOR" } } },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
        prisma.person.findMany({
            where: { movies: { some: { role: "DIRECTOR" } } },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
    ]);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 text-left">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">People</h1>

                <div className="flex items-center gap-2">
                    <Link
                        href="#actors"
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-muted"
                    >
                        <User className="h-4 w-4" />
                        Actors
                    </Link>

                    <Link
                        href="#directors"
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-muted"
                    >
                        <Clapperboard className="h-4 w-4" />
                        Directors
                    </Link>
                </div>
            </div>

            {/* ACTORS */}
            <section id="actors" className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Actors</h2>
                    <div className="text-sm text-muted-foreground">{actors.length} total</div>
                </div>

                {actors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No actors yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {actors.map((p) => (
                            <Link
                                key={p.id}
                                href={`/people/${p.id}`}
                                className="group border rounded-lg p-3 hover:bg-muted transition"
                            >
                                <div className="h-14 w-14 rounded-full border flex items-center justify-center mb-2">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                </div>

                                <div className="text-sm font-medium leading-tight group-hover:underline">
                                    {p.name}
                                </div>
                                <div className="text-xs text-muted-foreground">Actor</div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* DIRECTORS */}
            <section id="directors" className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Directors</h2>
                    <div className="text-sm text-muted-foreground">{directors.length} total</div>
                </div>

                {directors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No directors yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {directors.map((p) => (
                            <Link
                                key={p.id}
                                href={`/people/${p.id}`}
                                className="group border rounded-lg p-3 hover:bg-muted transition"
                            >
                                <div className="h-14 w-14 rounded-full border flex items-center justify-center mb-2">
                                    <Clapperboard className="h-6 w-6 text-muted-foreground" />
                                </div>

                                <div className="text-sm font-medium leading-tight group-hover:underline">
                                    {p.name}
                                </div>
                                <div className="text-xs text-muted-foreground">Director</div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
