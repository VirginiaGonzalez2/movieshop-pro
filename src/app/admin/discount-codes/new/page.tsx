import Link from "next/link";
import { createDiscountCode } from "@/actions/discount-code";
import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { DiscountScope, DiscountType } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import DiscountCodeForm from "../_components/DiscountCodeForm";

export default async function AdminNewDiscountCodePage() {
    await requireAdminArea("discounts");

    const movies = await prisma.movie.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
    });

    return (
        <div className="max-w-3xl space-y-4">
            <Link href="/admin/discount-codes" className="inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Discount Codes
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Create Discount Code</h2>
                <p className="text-sm text-muted-foreground">
                    Create a manual promo code and define its validity period and product scope.
                </p>
            </div>

            <DiscountCodeForm
                title="New Discount Code"
                description="Set up discount rules and availability."
                submitLabel="Create Discount Code"
                action={createDiscountCode}
                movies={movies}
                initialValue={{
                    code: "",
                    type: DiscountType.PERCENTAGE,
                    value: "10",
                    scope: DiscountScope.ALL_PRODUCTS,
                    startsAt: "",
                    endsAt: "",
                    usageLimit: "",
                    isActive: true,
                    selectedMovieIds: [],
                }}
            />
        </div>
    );
}
