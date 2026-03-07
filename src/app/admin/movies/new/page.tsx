import Link from "next/link";
import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import NewMovieForm from "./movie-form";
import { ArrowLeft } from "lucide-react";

export default async function AdminNewMoviePage() {
    await requireAdminArea("movies");

    const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
    const people = await prisma.person.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="max-w-3xl space-y-4">
            <Link href="/admin/movies" className="inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Movies
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Add Movie</h2>
                <p className="text-sm text-muted-foreground">
                    Create a new catalog item with pricing, media, and relationships.
                </p>
            </div>

            <div className="rounded-lg border p-5 bg-card">
            <NewMovieForm genres={genres} people={people} />
            </div>
        </div>
    );
}
