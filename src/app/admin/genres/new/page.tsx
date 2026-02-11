import { createGenre } from "@/actions/genre";

export default function AdminNewGenrePage() {
    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Add Genre</h1>

            <form action={createGenre} className="space-y-4">
                <input name="name" placeholder="Genre name" className="w-full border p-2" />
                <textarea
                    name="description"
                    placeholder="Description (optional)"
                    className="w-full border p-2"
                />
                <button className="bg-black text-white px-4 py-2 rounded">Create Genre</button>
            </form>
        </div>
    );
}
