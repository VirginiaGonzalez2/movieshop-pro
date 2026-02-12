import { createPerson } from "@/actions/person";

export default function AdminNewPersonPage() {
    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Add Person</h1>

            <form action={createPerson} className="space-y-4">
                <input name="name" placeholder="Name" className="w-full border p-2" />

                <textarea name="bio" placeholder="Bio" className="w-full border p-2" />

                <button className="bg-black text-white px-4 py-2 rounded">Create Person</button>
            </form>
        </div>
    );
}
