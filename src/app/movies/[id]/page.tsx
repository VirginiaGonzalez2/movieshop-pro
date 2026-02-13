import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import Link from "next/link";
import { PriceTag } from "@/components/ui/PriceTag";

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams.id);

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Invalid movie id</h1>
                <p className="text-muted-foreground">
                    URL must look like: <code>/movies/1</code>
                </p>
                <div className="mt-4">
                    <Link className="text-blue-600" href="/movies">
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    const movie = await prisma.movie.findUnique({ where: { id } });

    if (!movie) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-semibold">Movie not found</h1>
                <div className="mt-4">
                    <Link className="text-blue-600" href="/movies">
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    const people = await prisma.moviePerson.findMany({
        where: { movieId: movie.id },
        include: { person: true },
        orderBy: [{ role: "asc" }, { personId: "asc" }],
    });

    const directors = people.filter((p) => p.role === Role.DIRECTOR).map((p) => p.person.name);

    const actors = people.filter((p) => p.role === Role.ACTOR).map((p) => p.person.name);

    return (
        <div className="p-8 max-w-3xl space-y-4">
            <Link className="text-blue-600" href="/movies">
                ← Back to Movies
            </Link>

            <div className="border rounded p-6 space-y-3">
                <h1 className="text-3xl font-bold">{movie.title}</h1>

                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                    <PriceTag amount={movie.price.toString()} />
                    <span>•</span>
                    <span>Runtime: {movie.runtime} min</span>
                    <span>•</span>
                    <span>Stock: {movie.stock}</span>
                </div>

                <p className="leading-relaxed">{movie.description}</p>

                <div className="text-sm">
                    <span className="font-semibold">Director:</span>{" "}
                    {directors.length > 0 ? directors.join(", ") : "—"}
                </div>

                <div className="text-sm">
                    <span className="font-semibold">Cast:</span>{" "}
                    {actors.length > 0 ? actors.join(", ") : "—"}
                </div>

                {movie.imageUrl ? (
                    <div className="pt-2">
                        {/* Keeping it simple: render image only if URL exists */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="w-full max-w-md rounded border"
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
