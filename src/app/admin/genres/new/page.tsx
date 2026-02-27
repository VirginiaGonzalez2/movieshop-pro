import Link from "next/link";
import { createGenre } from "@/actions/genre";
import { ArrowLeft, Plus } from "lucide-react";

export default function AdminNewGenrePage() {
    return (
        <div className="p-8 max-w-xl">
            <Link href="/admin/genres" className="inline-flex items-center gap-2 text-sm mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Genres
            </Link>

            <h1 className="text-2xl font-bold mb-2">Add Genre</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Create a genre to organize your movies.
            </p>

            <form action={createGenre} className="space-y-4 border rounded-lg p-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        name="name"
                        placeholder="Genre name"
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        className="w-full border rounded-md p-2 min-h-[120px]"
                    />
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
                >
                    <Plus className="h-4 w-4" />
                    Create Genre
                </button>
            </form>
        </div>
    );
}
