import { createMovie } from "@/actions/movie";

export default function NewMoviePage() {
  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Add Movie</h1>

      <form action={createMovie} className="space-y-4">
        <input name="title" placeholder="Title" className="w-full border p-2" />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full border p-2"
        />
        <input name="releaseDate" type="date" className="w-full border p-2" />
        <input
          name="runtime"
          type="number"
          placeholder="Runtime (minutes)"
          className="w-full border p-2"
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          className="w-full border p-2"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="w-full border p-2"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Create Movie
        </button>
      </form>
    </div>
  );
}
