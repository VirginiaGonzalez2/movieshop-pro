"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * MoviesSortBar (Client Component)
 *
 * Responsibilities:
 * - Read current `sort` value from URL
 * - Update only the `sort` query parameter
 * - Preserve other query params (filters, page, etc.)
 *
 * This keeps sorting URL-driven and server-controlled.
 */

export default function MoviesSortBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") ?? "new";

    function updateSort(value: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("sort", value);

        // Reset page if pagination exists in future
        params.delete("page");

        router.push(`/movies?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant={currentSort === "new" ? "default" : "outline"}
                onClick={() => updateSort("new")}
            >
                New
            </Button>

            <Button
                variant={currentSort === "az" ? "default" : "outline"}
                onClick={() => updateSort("az")}
            >
                A–Z
            </Button>

            <Button
                variant={currentSort === "price" ? "default" : "outline"}
                onClick={() => updateSort("price")}
            >
                Price
            </Button>

            <Button
                variant={currentSort === "popular" ? "default" : "outline"}
                onClick={() => updateSort("popular")}
            >
                Popular
            </Button>
        </div>
    );
}
