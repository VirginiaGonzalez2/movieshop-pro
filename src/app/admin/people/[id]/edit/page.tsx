import Link from "next/link";
import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { updatePerson } from "@/actions/person";
import { ArrowLeft } from "lucide-react";

export default async function AdminEditPersonPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    await requireAdminArea("people");

    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams.id);

    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) return <div className="text-sm text-muted-foreground">Person not found</div>;

    const updateWithId = updatePerson.bind(null, person.id);

    return (
        <div className="max-w-2xl space-y-4">
            <Link href="/admin/people" className="inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to People
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Edit Person</h2>
                <p className="text-sm text-muted-foreground">Update person details.</p>
            </div>

            <form action={updateWithId} className="space-y-4 rounded-lg border p-5 bg-card">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        name="name"
                        defaultValue={person.name}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                        name="bio"
                        defaultValue={person.bio ?? ""}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">
                    Update Person
                </button>
            </form>
        </div>
    );
}
