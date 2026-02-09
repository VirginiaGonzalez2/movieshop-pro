import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteMovie } from "@/actions/movie";

export default async function MoviesAdminPage() {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movies</h1>
        <Link
          href="/admin/movies/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Movie
        </Link>
      </div>

      <div className="space-y-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="border p-4 rounded flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">${movie.price.toString()}</p>
            </div>

            <div className="flex gap-4 items-center">
              <Link
                href={`/admin/movies/${movie.id}/edit`}
                className="text-blue-600"
              >
                Edit
              </Link>

              <form action={async () => deleteMovie(movie.id)}>
                <button className="text-red-600">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
