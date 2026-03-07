import Link from "next/link";
import { createPerson } from "@/actions/person";
import { requireAdminArea } from "@/lib/admin-rbac";
import { ArrowLeft } from "lucide-react";

export default async function AdminNewPersonPage() {
    await requireAdminArea("people");

    return (
        <div className="max-w-2xl space-y-4">
            <Link href="/admin/people" className="inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to People
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Add Person</h2>
                <p className="text-sm text-muted-foreground">
                    Create a new actor or director profile.
                </p>
            </div>

            <form action={createPerson} className="space-y-4 rounded-lg border p-5 bg-card">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Name</label>
                    <input name="name" placeholder="Name" className="w-full border rounded-md p-2" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea name="bio" placeholder="Bio" className="w-full border rounded-md p-2" />
                </div>

                <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">
                    Create Person
                </button>
            </form>
        </div>
    );
}
