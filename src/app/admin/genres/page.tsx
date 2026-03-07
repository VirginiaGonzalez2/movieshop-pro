import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGenre } from "@/actions/genre";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requireAdminArea } from "@/lib/admin-rbac";

const defaultGenreDescriptions: Record<string, string> = {
    Action: "Fast-paced movies with intense sequences and high-stakes conflict.",
    Animation: "Animated stories for all ages, from family adventures to mature themes.",
    Comedy: "Lighthearted films designed to entertain through humor and wit.",
    Drama: "Character-driven stories focused on emotion, conflict, and realism.",
    Romance: "Love-centered stories exploring relationships and emotional connection.",
    "Sci-Fi": "Speculative films featuring futuristic technology, science, or space themes.",
    Thriller: "Suspenseful movies built around tension, danger, and twists.",
};

export default async function AdminGenresPage() {
    await requireAdminArea("genres");

    let genres = await prisma.genre.findMany({
        orderBy: { name: "asc" },
    });

    const missingDescriptions = genres.filter((genre) => {
        const hasDescription = Boolean(genre.description?.trim());
        return !hasDescription && Boolean(defaultGenreDescriptions[genre.name]);
    });

    if (missingDescriptions.length > 0) {
        await prisma.$transaction(
            missingDescriptions.map((genre) =>
                prisma.genre.update({
                    where: { id: genre.id },
                    data: { description: defaultGenreDescriptions[genre.name] },
                }),
            ),
        );

        genres = await prisma.genre.findMany({
            orderBy: { name: "asc" },
        });
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Genres</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage genres used for classifying movies.
                    </p>
                </div>

                <Link
                    href="/admin/genres/new"
                    className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Add Genre
                </Link>
            </div>

            {genres.length === 0 ? (
                <div className="border rounded-lg p-8 text-center">
                    <div className="text-lg font-semibold">No genres yet</div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create your first genre to start organizing movies.
                    </p>
                    <Link
                        href="/admin/genres/new"
                        className="inline-flex items-center gap-2 mt-4 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Genre
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="md:hidden space-y-3">
                        {genres.map((g) => (
                            <div key={g.id} className="rounded-lg border p-4 space-y-3 bg-card">
                                <div>
                                    <div className="font-medium">{g.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {g.id}</div>
                                </div>

                                <div className="text-sm text-muted-foreground leading-6">
                                    {g.description?.trim() || defaultGenreDescriptions[g.name] || "—"}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/genres/${g.id}/edit`}
                                        title="Edit"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>

                                    <form action={deleteGenre.bind(null, g.id)}>
                                        <button
                                            type="submit"
                                            title="Delete"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block rounded-lg border">
                        <div className="overflow-x-auto">
                            <div className="min-w-[760px]">
                                <div className="grid grid-cols-12 px-4 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground">
                                    <div className="col-span-4">Name</div>
                                    <div className="col-span-7">Description</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                <div className="divide-y">
                                    {genres.map((g) => (
                                        <div key={g.id} className="grid grid-cols-12 items-center px-4 py-3">
                                            <div className="col-span-4 min-w-0">
                                                <div className="font-medium truncate">{g.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: {g.id}</div>
                                            </div>

                                            <div className="col-span-7 text-sm text-muted-foreground line-clamp-2 pr-4">
                                                {g.description?.trim() ||
                                                    defaultGenreDescriptions[g.name] ||
                                                    "—"}
                                            </div>

                                            <div className="col-span-1 flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/genres/${g.id}/edit`}
                                                    title="Edit"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>

                                                <form action={deleteGenre.bind(null, g.id)}>
                                                    <button
                                                        type="submit"
                                                        title="Delete"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
