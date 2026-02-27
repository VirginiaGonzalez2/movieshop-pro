import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGenre } from "@/actions/genre";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function AdminGenresPage() {
    const genres = await prisma.genre.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Admin: Genres</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage genres used for classifying movies.
                    </p>
                </div>

                <Link
                    href="/admin/genres/new"
                    className="inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
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
                        className="inline-flex items-center gap-2 mt-4 rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Genre
                    </Link>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 px-4 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-6">Description</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y">
                        {genres.map((g) => (
                            <div key={g.id} className="grid grid-cols-12 items-center px-4 py-3">
                                <div className="col-span-5">
                                    <div className="font-medium">{g.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {g.id}</div>
                                </div>

                                <div className="col-span-6 text-sm text-muted-foreground line-clamp-2">
                                    {g.description?.trim() ? g.description : "—"}
                                </div>

                                <div className="col-span-1 flex justify-end gap-2">
                                    {/* Edit icon button */}
                                    <Link
                                        href={`/admin/genres/${g.id}/edit`}
                                        title="Edit"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>

                                    {/* Delete icon button */}
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
            )}
        </div>
    );
}
