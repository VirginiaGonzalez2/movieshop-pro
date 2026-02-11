import { prisma } from "@/lib/prisma";
import { updateGenre } from "@/actions/genre";

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
      </div>
    );
  }

  const genre = await prisma.genre.findUnique({ where: { id } });

  if (!genre) return <div className="p-8">Genre not found</div>;

  const updateWithId = updateGenre.bind(null, genre.id);

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Genre</h1>

      <form action={updateWithId} className="space-y-4">
        <input
          name="name"
          defaultValue={genre.name}
          className="w-full border p-2"
        />
        <textarea
          name="description"
          defaultValue={genre.description ?? ""}
          className="w-full border p-2"
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          Update Genre
        </button>
      </form>
    </div>
  );
}
