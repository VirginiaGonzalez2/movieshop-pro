import Link from "next/link";
import { updateDiscountCode } from "@/actions/discount-code";
import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import DiscountCodeForm from "../../_components/DiscountCodeForm";

function toDateTimeLocal(value: Date | null): string {
    if (!value) return "";

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function AdminEditDiscountCodePage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    await requireAdminArea("discounts");

    const resolved = await Promise.resolve(params);
    const id = Number(resolved.id);

    if (!Number.isInteger(id) || id <= 0) {
        notFound();
    }

    const [discountCode, movies] = await Promise.all([
        prisma.discountCode.findUnique({
            where: { id },
            include: {
                products: {
                    select: { movieId: true },
                },
            },
        }),
        prisma.movie.findMany({
            orderBy: { title: "asc" },
            select: { id: true, title: true },
        }),
    ]);

    if (!discountCode) {
        notFound();
    }

    return (
        <div className="max-w-3xl space-y-4">
            <Link href="/admin/discount-codes" className="inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Discount Codes
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Edit Discount Code</h2>
                <p className="text-sm text-muted-foreground">
                    Update availability, duration, and selected products.
                </p>
            </div>

            <DiscountCodeForm
                title={`Editing ${discountCode.code}`}
                description="Changes apply immediately after saving."
                submitLabel="Save Changes"
                action={updateDiscountCode.bind(null, id)}
                movies={movies}
                initialValue={{
                    code: discountCode.code,
                    type: discountCode.type,
                    value: discountCode.value.toString(),
                    scope: discountCode.scope,
                    startsAt: toDateTimeLocal(discountCode.startsAt),
                    endsAt: toDateTimeLocal(discountCode.endsAt),
                    usageLimit: discountCode.usageLimit?.toString() ?? "",
                    isActive: discountCode.isActive,
                    selectedMovieIds: discountCode.products.map((p) => p.movieId),
                }}
            />
        </div>
    );
}
