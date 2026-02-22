import { prisma } from "@/lib/prisma";
import Link from "next/link";

/*
  IMPORTANT CHANGE FOR NEXT 16:

  In Next.js 16, `searchParams` is no longer a normal object.
  It is now a Promise.

  If we try to access searchParams.q directly,
  it will be undefined and the header search will not work.

  So we must:
  1) Type it as a Promise
  2) Await it before using it
*/

type SearchPageProps = {
    searchParams: Promise<{
        q?: string | string[];
    }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    /*
    REQUIRED IN NEXT 16:
    We must unwrap (await) searchParams
    before accessing its properties.
  */
    const params = await searchParams;

    /*
    Normalize q (it can come as string or string[])
  */
    const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;

    /*
    Clean up whitespace to avoid empty searches like "   "
  */
    const query = rawQuery?.trim() || "";

    /*
    If query exists → filter results
    If not → show all movies
  */
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
                <div className="flex flex-col items-center justify-center py-16">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-4 h-16 w-16 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8zm0 0v2m0 4h.01"
                        />
                    </svg>

                    <p className="mb-2 text-lg font-semibold text-muted-foreground">
                        No movies found with that name.
                    </p>

                    <p className="text-sm text-muted-foreground">Please try another search term.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                        <li
                            key={movie.id}
                            className="rounded-lg border p-4 transition hover:shadow-md"
                        >
                            <h2 className="mb-2 text-lg font-medium">{movie.title}</h2>

                            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
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
