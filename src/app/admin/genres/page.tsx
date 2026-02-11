import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGenre } from "@/actions/genre";

export default async function AdminGenresPage() {
    const genres = await prisma.genre.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin: Genres</h1>

                <Link href="/admin/genres/new" className="bg-black text-white px-4 py-2 rounded">
                    + Add Genre
                </Link>
            </div>

            {genres.length === 0 ? (
                <p className="text-muted-foreground">No genres yet.</p>
            ) : (
                <div className="space-y-3">
                    {genres.map((g) => (
                        <div key={g.id} className="border rounded p-4 flex justify-between">
                            <div>
                                <div className="font-semibold">{g.name}</div>
                                {g.description ? (
                                    <div className="text-sm text-muted-foreground">
                                        {g.description}
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex gap-4 items-center">
                                <Link className="text-blue-600" href={`/admin/genres/${g.id}/edit`}>
                                    Edit
                                </Link>

                                <form action={deleteGenre.bind(null, g.id)}>
                                    <button className="text-red-600">Delete</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
