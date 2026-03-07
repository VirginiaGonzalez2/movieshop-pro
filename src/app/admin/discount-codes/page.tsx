import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminArea } from "@/lib/admin-rbac";
import { DiscountCodeRow } from "./_components/DiscountCodeRow";

export default async function AdminDiscountCodesPage() {
    await requireAdminArea("discounts");

    const discountCodes = await prisma.discountCode.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            products: {
                include: {
                    movie: { select: { title: true } },
                },
            },
        },
    });

    // Serialize data for client component
    const serializedCodes = discountCodes.map(code => ({
        id: code.id,
        code: code.code,
        type: code.type,
        value: code.value.toString(),
        scope: code.scope,
        startsAt: code.startsAt?.toISOString() ?? null,
        endsAt: code.endsAt?.toISOString() ?? null,
        usageCount: code.usageCount,
        usageLimit: code.usageLimit,
        isActive: code.isActive,
        products: code.products,
    }));

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="rounded-lg border bg-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Discount Codes</h2>
                        <p className="text-sm text-muted-foreground">
                            Create and manage promotional codes with custom validity periods and product scope.
                        </p>
                    </div>

                    <Link
                        href="/admin/discount-codes/new"
                        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <span className="mr-1.5 text-lg">+</span>
                        New Discount Code
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            {serializedCodes.length === 0 ? (
                <div className="rounded-lg border bg-card p-12 text-center">
                    <div className="mx-auto max-w-md space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">
                            📋
                        </div>
                        <h3 className="text-lg font-semibold">No discount codes yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Create your first promotional code to start offering discounts to your customers.
                        </p>
                        <Link
                            href="/admin/discount-codes/new"
                            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity mt-4"
                        >
                            Create First Code
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-sm font-medium text-muted-foreground">Total Codes</div>
                            <div className="text-2xl font-bold mt-1">{serializedCodes.length}</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-sm font-medium text-muted-foreground">Active Codes</div>
                            <div className="text-2xl font-bold mt-1 text-green-600">
                                {serializedCodes.filter(c => c.isActive).length}
                            </div>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-sm font-medium text-muted-foreground">Total Usage</div>
                            <div className="text-2xl font-bold mt-1">
                                {serializedCodes.reduce((sum, c) => sum + c.usageCount, 0)}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {serializedCodes.map((code) => (
                            <DiscountCodeRow
                                key={code.id}
                                code={code}
                                variant="mobile"
                            />
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Code</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Scope</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Validity Period</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Usage</th>
                                        <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                                        <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {serializedCodes.map((code) => (
                                        <DiscountCodeRow
                                            key={code.id}
                                            code={code}
                                            variant="desktop"
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
