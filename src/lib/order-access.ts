import { createHmac, timingSafeEqual } from "crypto";

function getOrderAccessSecret(): string | null {
    return (
        process.env.ORDER_ACCESS_SECRET ??
        process.env.BETTER_AUTH_SECRET ??
        process.env.NEXTAUTH_SECRET ??
        process.env.AUTH_SECRET ??
        process.env.DATABASE_URL ??
        null
    );
}

function getOrderAccessPayload(orderId: number, orderUserId: string): string {
    return `${orderId}:${orderUserId}`;
}

export function createOrderGuestAccessToken(orderId: number, orderUserId: string): string | null {
    const secret = getOrderAccessSecret();

    if (!secret) {
        return null;
    }

    return createHmac("sha256", secret)
        .update(getOrderAccessPayload(orderId, orderUserId))
        .digest("hex");
}

export function isOrderGuestAccessTokenValid(
    orderId: number,
    orderUserId: string,
    token?: string,
): boolean {
    if (!token) {
        return false;
    }

    const expected = createOrderGuestAccessToken(orderId, orderUserId);
    if (!expected || expected.length !== token.length) {
        return false;
    }

    try {
        return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
    } catch {
        return false;
    }
}
