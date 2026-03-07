/**
 *   Author: Maria Virgina Gonzalez
 *   Description: Wishlist button with counter badge for header
 */

"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    initialCount?: number;
};

export function WishlistButton({ initialCount = 0 }: Props) {
    const [count, setCount] = useState(initialCount);

    // Optional: Refresh wishlist count periodically or on storage changes
    useEffect(() => {
        // Listen for custom storage event (could be emitted by wishlist toggle)
        const handleStorageChange = () => {
            // Could fetch fresh count here if needed
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Link
            href="/wishlist"
            className="relative h-9 px-3 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="View wishlist"
            aria-label={`Wishlist (${count} items)`}
        >
            <Heart className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </Link>
    );
}
