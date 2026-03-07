import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitRule = {
    key: string;
    matches: (request: NextRequest) => boolean;
    limit: number;
    windowSeconds: number;
};

type HitWindow = {
    count: number;
    resetAt: number;
};

type RateLimitResult = {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
};

const hitStore = new Map<string, HitWindow>();
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
    upstashUrl && upstashToken
        ? new Redis({
              url: upstashUrl,
              token: upstashToken,
          })
        : null;

const limiterStore = new Map<string, Ratelimit>();

const rules: RateLimitRule[] = [
    {
        key: "auth",
        matches: (request) => request.nextUrl.pathname.startsWith("/api/auth"),
        limit: 60,
        windowSeconds: 60,
    },
    {
        key: "checkout",
        matches: (request) =>
            request.method === "POST" && request.nextUrl.pathname.startsWith("/checkout"),
        limit: 20,
        windowSeconds: 60,
    },
    {
        key: "contact",
        matches: (request) =>
            request.method === "POST" &&
            (request.nextUrl.pathname.startsWith("/contact") ||
                request.nextUrl.pathname.startsWith("/contact-us")),
        limit: 20,
        windowSeconds: 60,
    },
];

function getUpstashLimiter(rule: RateLimitRule): Ratelimit | null {
    if (!redis) {
        return null;
    }

    const existing = limiterStore.get(rule.key);
    if (existing) {
        return existing;
    }

    const limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(rule.limit, `${rule.windowSeconds} s`),
        prefix: `rl:${rule.key}`,
        analytics: false,
    });

    limiterStore.set(rule.key, limiter);
    return limiter;
}

function cleanupStore(now: number) {
    for (const [key, window] of hitStore.entries()) {
        if (window.resetAt <= now) {
            hitStore.delete(key);
        }
    }
}

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const firstIp = forwarded.split(",")[0]?.trim();
        if (firstIp) {
            return firstIp;
        }
    }

    return request.headers.get("x-real-ip") ?? "unknown";
}

function getRule(request: NextRequest): RateLimitRule | null {
    for (const rule of rules) {
        if (rule.matches(request)) {
            return rule;
        }
    }

    return null;
}

async function applyInMemoryRateLimit(
    rule: RateLimitRule,
    clientKey: string,
): Promise<RateLimitResult> {
    const now = Date.now();
    cleanupStore(now);

    const current = hitStore.get(clientKey);

    if (!current || current.resetAt <= now) {
        const resetAt = now + rule.windowSeconds * 1000;
        hitStore.set(clientKey, { count: 1, resetAt });
        return {
            allowed: true,
            limit: rule.limit,
            remaining: Math.max(rule.limit - 1, 0),
            resetAt,
        };
    }

    current.count += 1;
    hitStore.set(clientKey, current);

    const remaining = Math.max(rule.limit - current.count, 0);

    return {
        allowed: current.count <= rule.limit,
        limit: rule.limit,
        remaining,
        resetAt: current.resetAt,
    };
}

export async function applyRateLimit(request: NextRequest): Promise<RateLimitResult | null> {
    const rule = getRule(request);
    if (!rule) {
        return null;
    }

    const clientKey = `${rule.key}:${getClientIp(request)}`;

    const upstashLimiter = getUpstashLimiter(rule);
    if (upstashLimiter) {
        const result = await upstashLimiter.limit(clientKey);
        return {
            allowed: result.success,
            limit: rule.limit,
            remaining: Math.max(result.remaining, 0),
            resetAt: result.reset,
        };
    }

    return applyInMemoryRateLimit(rule, clientKey);
}
