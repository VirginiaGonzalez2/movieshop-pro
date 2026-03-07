import { deleteContactMessageAdminAction } from "@/actions/admin-data";
import { requireAdminArea } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";

export default async function AdminContactMessagesPage() {
    await requireAdminArea("messages");

    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold">Contact Messages</h2>
                <p className="text-sm text-muted-foreground">
                    View and manage customer messages sent from the contact form.
                </p>
            </div>

            {messages.length === 0 ? (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    No contact messages yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div key={message.id} className="border rounded-lg p-4 sm:p-5 space-y-3 bg-card">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="font-semibold">{message.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {message.email}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground rounded-full border px-2 py-1">
                                    {new Date(message.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <p className="text-sm whitespace-pre-wrap rounded-md border bg-background p-3">
                                {message.message}
                            </p>

                            <form
                                action={deleteContactMessageAdminAction.bind(null, message.id)}
                                className="pt-1"
                            >
                                <button
                                    type="submit"
                                    className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
