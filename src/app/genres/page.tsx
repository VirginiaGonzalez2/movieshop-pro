// Revalidate genre data every 60 seconds
export const revalidate = 60
import { prisma } from "@/lib/prisma";
import GenresClient from "./genres-client";

export default async function GenresPage() {
    const genres = await prisma.genre.findMany({
        orderBy: { name: "asc" },
    });

    const items = genres.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description ?? null,
    }));

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Genres</h1>

            {items.length === 0 ? (
                <p className="text-muted-foreground">No genres found yet.</p>
            ) : (
                <GenresClient items={items} />
            )}
        </div>
    );
}
