import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePerson } from "@/actions/person";

export default async function AdminPeoplePage() {
    const people = await prisma.person.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin: People</h1>

                <Link href="/admin/people/new" className="bg-black text-white px-4 py-2 rounded">
                    + Add Person
                </Link>
            </div>

            {people.length === 0 ? (
                <p>No people yet.</p>
            ) : (
                <div className="space-y-3">
                    {people.map((p) => (
                        <div key={p.id} className="border rounded p-4 flex justify-between">
                            <div>
                                <div className="font-semibold">{p.name}</div>
                                {p.bio && <div className="text-sm">{p.bio}</div>}
                            </div>

                            <div className="flex gap-4">
                                <Link href={`/admin/people/${p.id}/edit`}>Edit</Link>

                                <form action={deletePerson.bind(null, p.id)}>
                                    <button>Delete</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
