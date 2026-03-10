import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/movies/MovieCard";
import MoviePanel from "@/components/filters/MovieFilterPanel";
import Link from "next/link";
import SortSelect from "@/components/SortSelect";

export const dynamic = "force-dynamic";

const SORT_OPTIONS = [
  { value: "new", label: "New" },
  { value: "az", label: "A-Z" },
  { value: "popular", label: "Popular" },
  { value: "price", label: "Price" },
];

export default async function MoviesTestPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const sort = searchParams?.sort ?? "new";
  let orderBy;
  switch (sort) {
    case "az":
      orderBy = { title: "asc" };
      break;
    case "price":
      orderBy = { price: "asc" };
      break;
    case "popular":
      orderBy = { createdAt: "desc" };
      break;
    case "new":
      orderBy = { releaseDate: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Filters
  const genreFilter = searchParams?.genre ? { genres: { some: { genre: { id: { in: searchParams.genre.split(",") } } } } } : {};
  const directorFilter = searchParams?.director ? { people: { some: { person: { id: { in: searchParams.director.split(",") } }, role: "DIRECTOR" } } } : {};
  const actorFilter = searchParams?.actor ? { people: { some: { person: { id: { in: searchParams.actor.split(",") } }, role: "ACTOR" } } } : {};
  const where = { ...genreFilter, ...directorFilter, ...actorFilter };
  const movies = await prisma.movie.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true,
      stock: true,
      runtime: true,
      releaseDate: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      trailerUrl: true,
    },
  });

  // Filtros de ejemplo (puedes conectar con MoviePanel y lógica real)
  const genres = await prisma.genre.findMany();
  const directors = await prisma.person.findMany();
  const actors = await prisma.person.findMany();

  // Extract selected filter values from searchParams
  const selectedGenres = searchParams?.genre ? searchParams.genre.split(",") : [];
  const selectedDirectors = searchParams?.director ? searchParams.director.split(",") : [];
  const selectedActors = searchParams?.actor ? searchParams.actor.split(",") : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Panel lateral de filtros */}
        <aside className="hidden md:block md:col-span-3">
          <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-24 h-fit">
            <MoviePanel
              genres={Array.isArray(genres) ? genres.map((g) => ({ id: g.id.toString(), name: g.name })) : []}
              selectedGenres={selectedGenres}
              directors={Array.isArray(directors) ? directors.map((d) => ({ id: d.id.toString(), name: d.name })) : []}
              selectedDirectors={selectedDirectors}
              actors={Array.isArray(actors) ? actors.map((a) => ({ id: a.id.toString(), name: a.name })) : []}
              selectedActors={selectedActors}
            />
          </div>
        </aside>
        {/* Área de películas */}
        <div className="col-span-1 md:col-span-9">
          <div className="mb-6 flex gap-4 items-center">
            <h1 className="text-2xl font-bold">Movies Catalog</h1>
            <SortSelect sort={sort} options={SORT_OPTIONS} />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <li key={movie.id} className="bg-white rounded-xl shadow p-4">
                <Link href={`/movies/${movie.id}`}> 
                  <MovieCard movie={{ ...movie, price: movie.price.toString() }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
