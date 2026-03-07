"use client";

import Link from "next/link";
import { deleteDiscountCode, toggleDiscountCodeActive } from "@/actions/discount-code";

function formatDateTime(value: string | null): string {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusLabel(code: {
    isActive: boolean;
    startsAt: string | null;
    endsAt: string | null;
}): { label: string; color: string } {
    if (!code.isActive) return { label: "Inactive", color: "text-gray-500 bg-gray-100" };

    const now = new Date();
    const startsAt = code.startsAt ? new Date(code.startsAt) : null;
    const endsAt = code.endsAt ? new Date(code.endsAt) : null;
    
    if (startsAt && startsAt > now) return { label: "Scheduled", color: "text-blue-700 bg-blue-100" };
    if (endsAt && endsAt < now) return { label: "Expired", color: "text-red-700 bg-red-100" };

    return { label: "Active", color: "text-green-700 bg-green-100" };
}

interface DiscountCodeRowProps {
    code: {
        id: number;
        code: string;
        type: string;
        value: string;
        scope: string;
        startsAt: string | null;
        endsAt: string | null;
        usageCount: number;
        usageLimit: number | null;
        isActive: boolean;
        products: Array<{ movie: { title: string } }>;
    };
    variant: "mobile" | "desktop";
}

export function DiscountCodeRow({ code, variant }: DiscountCodeRowProps) {
    const handleDelete = (e: React.FormEvent) => {
        if (!confirm(`¿Estás seguro de eliminar el código "${code.code}"? Esta acción no se puede deshacer.`)) {
            e.preventDefault();
        }
    };

    const status = getStatusLabel(code);

    if (variant === "mobile") {
        return (
            <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="font-bold text-lg">{code.code}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                            {code.type === "PERCENTAGE"
                                ? `${code.value}% off`
                                : `$${code.value} off`}
                        </div>
                    </div>

                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <div className="text-xs text-muted-foreground font-medium">Scope</div>
                        <div className="mt-1">
                            {code.scope === "ALL_PRODUCTS"
                                ? "All products"
                                : `${code.products.length} products`}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground font-medium">Usage</div>
                        <div className="mt-1">
                            {code.usageCount}
                            {code.usageLimit ? ` / ${code.usageLimit}` : " / ∞"}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Start:</span>
                        <span className="font-medium">{formatDateTime(code.startsAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">End:</span>
                        <span className="font-medium">{formatDateTime(code.endsAt)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Link
                        href={`/admin/discount-codes/${code.id}/edit`}
                        className="flex-1 text-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Edit
                    </Link>

                    <form action={toggleDiscountCodeActive.bind(null, code.id)} className="flex-1">
                        <button
                            type="submit"
                            className="w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            {code.isActive ? "Disable" : "Enable"}
                        </button>
                    </form>

                    <form action={deleteDiscountCode.bind(null, code.id)} onSubmit={handleDelete} className="flex-1">
                        <button
                            type="submit"
                            className="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <tr className="hover:bg-muted/30 transition-colors">
            <td className="py-4 px-4">
                <div className="font-semibold text-base">{code.code}</div>
            </td>

            <td className="py-4 px-4">
                <div className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
                    {code.type === "PERCENTAGE"
                        ? `${code.value}%`
                        : `$${code.value}`}
                </div>
            </td>

            <td className="py-4 px-4">
                <div className="text-sm">
                    {code.scope === "ALL_PRODUCTS"
                        ? <span className="text-muted-foreground">All products</span>
                        : <span className="font-medium">{code.products.length} selected</span>}
                </div>
            </td>

            <td className="py-4 px-4">
                <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">{formatDateTime(code.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{formatDateTime(code.endsAt)}</span>
                    </div>
                </div>
            </td>

            <td className="py-4 px-4 text-center">
                <div className="text-sm font-medium">
                    {code.usageCount}
                    <span className="text-muted-foreground">
                        {code.usageLimit ? ` / ${code.usageLimit}` : " / ∞"}
                    </span>
                </div>
            </td>

            <td className="py-4 px-4 text-center">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                    {status.label}
                </span>
            </td>

            <td className="py-4 px-4">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/discount-codes/${code.id}/edit`}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                        Edit
                    </Link>

                    <form action={toggleDiscountCodeActive.bind(null, code.id)}>
                        <button
                            type="submit"
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            {code.isActive ? "Disable" : "Enable"}
                        </button>
                    </form>

                    <form action={deleteDiscountCode.bind(null, code.id)} onSubmit={handleDelete}>
                        <button
                            type="submit"
                            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    );
}
