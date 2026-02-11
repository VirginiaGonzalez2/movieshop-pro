import { prisma } from "@/lib/prisma";
import { updatePerson } from "@/actions/person";

export default async function AdminEditPersonPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams.id);

    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) return <div>Person not found</div>;

    const updateWithId = updatePerson.bind(null, person.id);

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Person</h1>

            <form action={updateWithId} className="space-y-4">
                <input name="name" defaultValue={person.name} className="w-full border p-2" />

                <textarea
                    name="bio"
                    defaultValue={person.bio ?? ""}
                    className="w-full border p-2"
                />

                <button className="bg-black text-white px-4 py-2 rounded">Update Person</button>
            </form>
        </div>
    );
}
