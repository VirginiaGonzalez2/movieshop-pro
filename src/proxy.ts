import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rate-limit";

export async function proxy(request: NextRequest) {
    const result = await applyRateLimit(request);

    if (!result) {
        return NextResponse.next();
    }

    if (result.allowed) {
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", String(result.limit));
        response.headers.set("X-RateLimit-Remaining", String(result.remaining));
        response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
        return response;
    }

    const retryAfter = Math.max(Math.ceil((result.resetAt - Date.now()) / 1000), 1);

    const response = NextResponse.json(
        {
            error: "Too many requests",
            retryAfter,
        },
        { status: 429 },
    );

    response.headers.set("Retry-After", String(retryAfter));
    response.headers.set("X-RateLimit-Limit", String(result.limit));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));

    return response;
}

export const config = {
    matcher: ["/api/auth/:path*", "/checkout/:path*", "/contact/:path*", "/contact-us/:path*"],
};
