import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { connectPersonToMovieRole, deletePerson, updatePersonMovieRole } from "@/actions/person";
import { requireAdminArea } from "@/lib/admin-rbac";

export default async function AdminPeoplePage() {
    await requireAdminArea("people");

    const people = await prisma.person.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { movies: true } },
            movies: {
                orderBy: { movie: { title: "asc" } },
                select: {
                    role: true,
                    movieId: true,
                    movie: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            },
        },
    });

    const movies = await prisma.movie.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
    });

    const normalizedPeople = people.map((person) => {
        const roles = new Set(person.movies.map((movie) => movie.role));
        const isDirector = roles.has("DIRECTOR");
        const isActor = roles.has("ACTOR");

        let roleLabel = "Unassigned";
        if (isDirector && isActor) roleLabel = "Director • Actor";
        else if (isDirector) roleLabel = "Director";
        else if (isActor) roleLabel = "Actor";

        return {
            ...person,
            isDirector,
            isActor,
            roleLabel,
        };
    });

    const directors = normalizedPeople.filter((person) => person.isDirector);
    const actors = normalizedPeople.filter((person) => person.isActor && !person.isDirector);
    const unassigned = normalizedPeople.filter((person) => !person.isDirector && !person.isActor);

    function renderSection(
        sectionTitle: string,
        sectionDescription: string,
        sectionPeople: typeof normalizedPeople,
        allowConnectToMovie: boolean = false,
    ) {
        return (
            <section className="space-y-3">
                <div>
                    <h3 className="font-semibold">{sectionTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                        {sectionDescription} • {sectionPeople.length}
                    </p>
                </div>

                {sectionPeople.length === 0 ? (
                    <div className="rounded-lg border p-5 text-sm text-muted-foreground">
                        No records in this group.
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="md:hidden space-y-3">
                            {sectionPeople.map((person) => (
                                <div key={person.id} className="rounded-lg border p-4 space-y-3 bg-card">
                                    <div>
                                        <div className="font-medium">{person.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {person.id}</div>
                                    </div>

                                    <div className="text-sm text-muted-foreground">{person.roleLabel}</div>

                                    <div className="text-sm text-muted-foreground">
                                        {person.bio?.trim() ? person.bio : "—"}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Linked Movies
                                        </div>

                                        {person.movies.length === 0 ? (
                                            <div className="space-y-2">
                                                <div className="text-sm text-muted-foreground">
                                                    No linked movies.
                                                </div>

                                                {allowConnectToMovie ? (
                                                    <form
                                                        action={connectPersonToMovieRole.bind(
                                                            null,
                                                            person.id,
                                                        )}
                                                        className="space-y-2 rounded-md border p-3"
                                                    >
                                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                            Connect to Movie
                                                        </div>
                                                        <select
                                                            name="movieId"
                                                            required
                                                            className="w-full border rounded-md px-2 py-1.5 text-xs bg-background"
                                                        >
                                                            <option value="">Select movie...</option>
                                                            {movies.map((movie) => (
                                                                <option key={movie.id} value={movie.id}>
                                                                    {movie.title}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                name="role"
                                                                defaultValue="ACTOR"
                                                                className="border rounded-md px-2 py-1.5 text-xs bg-background"
                                                            >
                                                                <option value="ACTOR">Actor</option>
                                                                <option value="DIRECTOR">Director</option>
                                                            </select>

                                                            <button
                                                                type="submit"
                                                                className="rounded-md border px-2 py-1.5 text-xs hover:bg-muted"
                                                            >
                                                                Connect
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {person.movies.map((connection) => (
                                                    <form
                                                        key={`${person.id}-${connection.movie.id}-${connection.role}`}
                                                        action={updatePersonMovieRole.bind(
                                                            null,
                                                            person.id,
                                                            connection.movie.id,
                                                        )}
                                                        className="flex items-center justify-between gap-2 rounded-md border p-2"
                                                    >
                                                        <div className="text-sm font-medium truncate">
                                                            {connection.movie.title}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="hidden"
                                                                name="previousRole"
                                                                value={connection.role}
                                                            />
                                                            <select
                                                                name="role"
                                                                defaultValue={connection.role}
                                                                className="border rounded-md px-2 py-1 text-xs bg-background"
                                                            >
                                                                <option value="ACTOR">Actor</option>
                                                                <option value="DIRECTOR">Director</option>
                                                            </select>
                                                            <button
                                                                type="submit"
                                                                className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </form>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        Linked movies: {person._count.movies}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/people/${person.id}/edit`}
                                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                        >
                                            Edit
                                        </Link>

                                        <form action={deletePerson.bind(null, person.id)}>
                                            <button
                                                type="submit"
                                                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block rounded-lg border">
                            <div className="overflow-x-auto">
                                <div className="min-w-[980px]">
                                    <div className="flex items-center px-4 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground">
                                        <div className="flex-1">Name</div>
                                        <div className="w-40">Role</div>
                                        <div className="w-72">Connections</div>
                                        <div className="w-16 text-center">Linked</div>
                                        <div className="w-48 text-right">Actions</div>
                                    </div>

                                    <div className="divide-y">
                                        {sectionPeople.map((person) => (
                                            <div key={person.id} className="flex items-center gap-4 px-4 py-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium whitespace-normal break-words">
                                                {person.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">ID: {person.id}</div>
                                        </div>

                                        <div className="w-40 text-sm text-muted-foreground">
                                            {person.roleLabel}
                                        </div>

                                        <div className="w-72 space-y-1">
                                            {person.movies.length === 0 ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-muted-foreground">
                                                        No linked movies.
                                                    </div>

                                                    {allowConnectToMovie ? (
                                                        <form
                                                            action={connectPersonToMovieRole.bind(
                                                                null,
                                                                person.id,
                                                            )}
                                                            className="space-y-2 rounded-md border p-2"
                                                        >
                                                            <select
                                                                name="movieId"
                                                                required
                                                                className="w-full border rounded-md px-2 py-1 text-xs bg-background"
                                                            >
                                                                <option value="">Select movie...</option>
                                                                {movies.map((movie) => (
                                                                    <option key={movie.id} value={movie.id}>
                                                                        {movie.title}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    name="role"
                                                                    defaultValue="ACTOR"
                                                                    className="border rounded-md px-2 py-1 text-xs bg-background"
                                                                >
                                                                    <option value="ACTOR">Actor</option>
                                                                    <option value="DIRECTOR">Director</option>
                                                                </select>

                                                                <button
                                                                    type="submit"
                                                                    className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                                                                >
                                                                    Connect
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                person.movies.map((connection) => (
                                                    <form
                                                        key={`${person.id}-${connection.movie.id}-${connection.role}`}
                                                        action={updatePersonMovieRole.bind(
                                                            null,
                                                            person.id,
                                                            connection.movie.id,
                                                        )}
                                                        className="flex items-center justify-between gap-2 rounded-md border p-2"
                                                    >
                                                        <div className="text-sm truncate">
                                                            {connection.movie.title}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="hidden"
                                                                name="previousRole"
                                                                value={connection.role}
                                                            />
                                                            <select
                                                                name="role"
                                                                defaultValue={connection.role}
                                                                className="border rounded-md px-2 py-1 text-xs bg-background"
                                                            >
                                                                <option value="ACTOR">Actor</option>
                                                                <option value="DIRECTOR">Director</option>
                                                            </select>
                                                            <button
                                                                type="submit"
                                                                className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </form>
                                                ))
                                            )}
                                        </div>

                                        <div className="w-16 text-sm text-muted-foreground text-center">
                                            {person._count.movies}
                                        </div>

                                            <div className="w-48 flex justify-end gap-2 shrink-0">
                                                <Link
                                                    href={`/admin/people/${person.id}/edit`}
                                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                                >
                                                    Edit
                                                </Link>

                                                <form action={deletePerson.bind(null, person.id)}>
                                                    <button
                                                        type="submit"
                                                        className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">People</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage actors and directors linked to the movie catalog.
                    </p>
                </div>

                <Link
                    href="/admin/people/new"
                    className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
                >
                    + Add Person
                </Link>
            </div>

            {people.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                    No people yet.
                </div>
            ) : (
                <div className="space-y-6">
                    {renderSection(
                        "Directors",
                        "People assigned to direct one or more movies",
                        directors,
                    )}

                    {renderSection(
                        "Actors",
                        "People assigned only as actors",
                        actors,
                    )}

                    {renderSection(
                        "Unassigned",
                        "People not yet linked to any actor/director role",
                        unassigned,
                        true,
                    )}
                </div>
            )}
        </div>
    );
}
