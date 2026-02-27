import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateGenre } from "@/actions/genre";
import { ArrowLeft, Save } from "lucide-react";

export default async function AdminEditGenrePage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams.id);

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Invalid genre id</h1>
                <p className="text-muted-foreground">
                    URL must look like: <code>/admin/genres/1/edit</code>
                </p>
                <Link href="/admin/genres" className="inline-flex items-center gap-2 mt-4 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Genres
                </Link>
            </div>
        );
    }

    const genre = await prisma.genre.findUnique({ where: { id } });

    if (!genre) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Genre not found</h1>
                <Link href="/admin/genres" className="inline-flex items-center gap-2 mt-4 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Genres
                </Link>
            </div>
        );
    }

    const updateWithId = updateGenre.bind(null, genre.id);

    return (
        <div className="p-8 max-w-xl">
            <Link href="/admin/genres" className="inline-flex items-center gap-2 text-sm mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Genres
            </Link>

            <h1 className="text-2xl font-bold mb-2">Edit Genre</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Update the name/description. Movies using this genre keep their links.
            </p>

            <form action={updateWithId} className="space-y-4 border rounded-lg p-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        name="name"
                        defaultValue={genre.name}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={genre.description ?? ""}
                        className="w-full border rounded-md p-2 min-h-[120px]"
                    />
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
                >
                    <Save className="h-4 w-4" />
                    Update Genre
                </button>
            </form>
        </div>
    );
}
