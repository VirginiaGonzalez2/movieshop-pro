/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-03-05 10:00:00
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-03-05 10:01:23
 * @ Description:
 */

import { useRouter, useSearchParams } from "next/navigation";

/**
 * A callback that can be used to redirect to checkout with a single item.
 * @param movieId ID of the movie to buy.
 * @returns The callback function.
 */
export function useBuyNow(movieId: number) {
    const params = useSearchParams();
    const router = useRouter();
    return () => {
        const newParams = new URLSearchParams(params);
        newParams.set("buy", movieId.toString());
        router.push(`/checkout?${newParams}`);
    };
}
