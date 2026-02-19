import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params?.q;

    const movies = await prisma.movie.findMany({
        where: query
            ? {
                  OR: [
                      {
                          title: {
                              contains: query,
                              mode: "insensitive",
                          },
                      },
                      {
                          description: {
                              contains: query,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : undefined,
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-semibold">
                {query ? `Search results for "${query}"` : "All movies"}
            </h1>

            {movies.length === 0 ? (
                <p className="text-muted-foreground">No movies found with that name.</p>
            ) : (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                        <li
                            key={movie.id}
                            className="rounded-lg border p-4 transition hover:shadow-md"
                        >
                            <h2 className="mb-2 text-lg font-medium">{movie.title}</h2>

                            <p className="mb-4 text-sm text-muted-foreground">
                                {movie.description}
                            </p>

                            <Link
                                href={`/movies/${movie.id}`}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View details →
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
