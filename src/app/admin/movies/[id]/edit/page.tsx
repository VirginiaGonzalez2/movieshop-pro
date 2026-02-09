import { prisma } from "@/lib/prisma";
import { updateMovie } from "@/actions/movie";

export default async function EditMoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await prisma.movie.findUnique({
    where: { id: Number(params.id) },
  });

  if (!movie) return <div className="p-8">Movie not found</div>;

  const updateWithId = updateMovie.bind(null, movie.id);

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>

      <form action={updateWithId} className="space-y-4">
        <input
          name="title"
          defaultValue={movie.title}
          className="w-full border p-2"
        />
        <textarea
          name="description"
          defaultValue={movie.description}
          className="w-full border p-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={movie.price.toString()}
          className="w-full border p-2"
        />
        <input
          name="releaseDate"
          type="date"
          defaultValue={movie.releaseDate.toISOString().split("T")[0]}
          className="w-full border p-2"
        />
        <input
          name="runtime"
          type="number"
          defaultValue={movie.runtime}
          className="w-full border p-2"
        />
        <input
          name="imageUrl"
          defaultValue={movie.imageUrl ?? ""}
          className="w-full border p-2"
        />
        <input
          name="stock"
          type="number"
          defaultValue={movie.stock}
          className="w-full border p-2"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Update Movie
        </button>
      </form>
    </div>
  );
}
