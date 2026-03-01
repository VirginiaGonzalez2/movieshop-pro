"use client";

import React from "react";
import { useRouter } from "next/navigation";

// This is a quick filter section for the Home page.
// It provides a set of category buttons that redirect users to the
// Movies page with a pre-filled `genre` query param for quick filtering.
export default function HomeQuickFilters() {
    const router = useRouter();

    const categories = ["Action", "Drama", "Comedy", "Animation", "Sci-Fi", "Fantasy"];

    // Navigate within Home and apply genre filter via query param.
    // This allows Home sections to re-render based on ?genre=...
    function goToGenre(genre: string) {
        // Navigate to Home with genre in the query so Home can server-filter sections
        router.push(`/?genre=${encodeURIComponent(genre)}`);
    }

    // Navigate to movies page (advanced filters)
    function goToAdvancedFilters() {
        router.push("/movies");
    }

    // Clear Home filters by navigating to root with no query params
    function clearFilters() {
        router.push("/");
    }

    return (
        // Compact professional quick-filters menu
        <section className="w-full bg-gray-50 py-12 border-y">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Browse by Category</h2>

                <p className="text-sm text-muted-foreground mb-6">
                    Discover movies by your favorite genres or explore advanced filters.
                </p>

                <div className="flex justify-center">
                    <nav className="inline-flex bg-white border rounded-lg shadow-sm px-3 py-2 gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => goToGenre(c)}
                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                            >
                                {c}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:underline"
                        aria-label="Clear filters"
                    >
                        Clear filters
                    </button>

                    <button
                        onClick={goToAdvancedFilters}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Explore Advanced Filters →
                    </button>
                </div>
            </div>
        </section>
    );
}
