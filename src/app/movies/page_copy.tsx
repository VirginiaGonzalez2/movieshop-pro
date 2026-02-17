import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import MovieCard from "@/app/_components/movies/MovieCard";
import MovieFilterPanel from "@/components/filters/MovieFilterPanel";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    genre?: string;
    director?: string;
    actor?: string;
  }>;
}) {
  const params = await searchParams;

  const genreFilter = params?.genre;
  const directorFilter = params?.director;
  const actorFilter = params?.actor;

  // Fetch all genres
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

  // Build the movie filter
  const filters: Prisma.MovieWhereInput[] = [];

  if (genreFilter && genreFilter !== "All") {
    filters.push({
      genres: {
        some: {
          genre: {
            name: {
              equals: genreFilter,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (directorFilter) {
    filters.push({
      people: {
        some: {
          role: Role.DIRECTOR,
          person: {
            name: {
              equals: directorFilter,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (actorFilter) {
    filters.push({
      people: {
        some: {
          role: Role.ACTOR,
          person: {
            name: {
              equals: actorFilter,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  const where: Prisma.MovieWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  // Fetch movies based on filters
  const movies = await prisma.movie.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // For the filter panel: show only directors/actors who have worked in movies of the selected genre
  let directorNames: string[] = [];
  let actorNames: string[] = [];

  if (genreFilter && genreFilter !== "All") {
    // Get movie IDs for the selected genre
    const moviesWithGenre = await prisma.movie.findMany({
      where: {
        genres: {
          some: {
            genre: {
              name: {
                equals: genreFilter,
                mode: "insensitive",
              },
            },
          },
        },
      },
      select: { id: true },
    });
    const movieIds = moviesWithGenre.map((m) => m.id);

    // Directors for movies in this genre
    const directors = await prisma.person.findMany({
      where: {
        movieRoles: {
          some: {
            role: Role.DIRECTOR,
            movieId: { in: movieIds },
          },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    });
    directorNames = directors.map((d) => d.name);

    // Actors for movies in this genre
    const actors = await prisma.person.findMany({
      where: {
        movieRoles: {
          some: {
            role: Role.ACTOR,
            movieId: { in: movieIds },
          },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    });
    actorNames = actors.map((a) => a.name);
  } else {
    // All directors and actors
    const directors = await prisma.person.findMany({
      where: {
        movieRoles: {
          some: { role: Role.DIRECTOR },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    });
    directorNames = directors.map((d) => d.name);

    const actors = await prisma.person.findMany({
      where: {
        movieRoles: {
          some: { role: Role.ACTOR },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    });
    actorNames = actors.map((a) => a.name);
  }

  // Get people for each movie
  const movieIds = movies.map((m) => m.id);

  const moviePeople =
    movieIds.length > 0
      ? await prisma.moviePerson.findMany({
          where: { movieId: { in: movieIds } },
          include: { person: true },
          orderBy: [{ movieId: "asc" }, { personId: "asc" }],
        })
      : [];

  const byMovie = new Map<number, { actors: string[]; directors: string[] }>();

  for (const mp of moviePeople) {
    const entry = byMovie.get(mp.movieId) ?? {
      actors: [],
      directors: [],
    };

    if (mp.role === Role.ACTOR) {
      entry.actors.push(mp.person.name);
    } else if (mp.role === Role.DIRECTOR) {
      entry.directors.push(mp.person.name);
    }

    byMovie.set(mp.movieId, entry);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Movies</h1>

      <MovieFilterPanel
        genres={genres}
        directors={directorNames}
        actors={actorNames}
      />

      {movies.length === 0 ? (
        <p className="text-muted-foreground mt-4">
          No movies found with the selected filters.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div
            className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4"
            style={{ minWidth: "100%" }}
          >
            {movies.map((movie) => {
              const info = byMovie.get(movie.id) ?? {
                actors: [],
                directors: [],
              };

              return (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    price:
                      typeof movie.price === "number"
                        ? movie.price
                        : Number(movie.price),
                    stock: movie.stock,
                    runtime: movie.runtime,
                  }}
                  actors={info.actors}
                  directors={info.directors}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
