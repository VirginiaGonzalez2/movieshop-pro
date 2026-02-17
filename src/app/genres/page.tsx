import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GenresPage() {
    const genres = await prisma.genre.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Genres</h1>

            {genres.length === 0 ? (
                <p className="text-muted-foreground">No genres found yet.</p>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {genres.map((g) => (
                        <Link
                            key={g.id}
                            href={`/genres/${g.id}`}
                            className="border rounded p-4 hover:bg-muted/40 transition"
                        >
                            <div className="font-semibold">{g.name}</div>

                            {g.description ? (
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                    {g.description}
                                </div>
                            ) : null}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
