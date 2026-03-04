"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionError, ActionSuccess, HTTPStatusCode } from "@/utils/action-util";
import { Order } from "@prisma/client";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers as nextHeaders } from "next/headers";

// Permission helper
async function hasPermission(
    userId: string,
    action: "create" | "get" | "get-own" | "delete",
    headers?: ReadonlyHeaders,
): Promise<boolean> {
    return (
        await auth.api.userHasPermission({
            headers: headers ?? (await nextHeaders()),
            body: {
                userId: userId,
                permissions: { orders: [action] },
            },
        })
    ).success;
}

// Actions

// async function createOrder(data: Order) {
//     const headers = await nextHeaders();
//     const session = await auth.api.getSession({ headers: headers });

//     if (!session) {
//         return { ok: false, statusCode: HTTPStatusCode.Unauthorized };
//     }

//     const permission = await hasPermission(session.user.id, "create", headers);
//     if (!permission) {
//         return { ok: false, statusCode: HTTPStatusCode.Forbidden };
//     }

//     // TODO: Fully implement when we need it and have time...
// }

async function getOrder(orderId: number): Promise<ActionSuccess<Order> | ActionError> {
    const headers = await nextHeaders();
    const session = await auth.api.getSession({ headers: headers });

    if (!session) {
        return { ok: false, statusCode: HTTPStatusCode.Unauthorized };
    }

    // Check if permission to get users own order.
    const permissionOwn = await hasPermission(session.user.id, "get-own", headers);
    if (!permissionOwn) {
        return { ok: false, statusCode: HTTPStatusCode.Forbidden };
    }

    const result = await prisma.order.findFirst({ where: { id: orderId } });

    if (!result) {
        return { ok: false, statusCode: HTTPStatusCode.NotFound };
    }

    if (result.userId !== session.user.id && !permissionOwn) {
        // Check if permission to get any order.
        const permissionAny = await hasPermission(session.user.id, "get", headers);
        if (!permissionAny) {
            return { ok: false, statusCode: HTTPStatusCode.Forbidden };
        }
    }

    return { ok: true, statusCode: HTTPStatusCode.OK, content: result };
}

async function getOrdersByUser(
    userId: number | string,
): Promise<ActionSuccess<Order[]> | ActionError> {
    const headers = await nextHeaders();
    const session = await auth.api.getSession({ headers: headers });

    if (!session) {
        return { ok: false, statusCode: HTTPStatusCode.Unauthorized };
    }

    const permissionOwn = await hasPermission(
        session.user.id,
        userId === session.user.id ? "get-own" : "get",
        headers,
    );
    if (!permissionOwn) {
        return { ok: false, statusCode: HTTPStatusCode.Forbidden };
    }

    const result = await prisma.order.findMany({ where: { userId: userId.toString() } });

    if (!result) {
        return { ok: false, statusCode: HTTPStatusCode.NotFound };
    }

    return { ok: true, statusCode: HTTPStatusCode.OK, content: result };
}

async function deleteOrder(orderId: number): Promise<ActionSuccess<Order> | ActionError> {
    const headers = await nextHeaders();
    const session = await auth.api.getSession({ headers: headers });

    if (!session) {
        return { ok: false, statusCode: HTTPStatusCode.Unauthorized };
    }

    const permission = await hasPermission(session.user.id, "delete", headers);
    if (!permission) {
        return { ok: false, statusCode: HTTPStatusCode.Forbidden };
    }

    const result = await prisma.order.delete({ where: { id: orderId } });

    if (!result) {
        return { ok: false, statusCode: HTTPStatusCode.NotFound };
    }

    return { ok: true, statusCode: HTTPStatusCode.OK, content: result };
}

async function claimGuestOrdersForUser(email: string, name: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) {
        return { ok: false as const, linked: 0 };
    }

    const result = await prisma.order.updateMany({
        where: {
            OR: [{ userId: email }, { userId: name }],
        },
        data: {
            userId: user.id,
        },
    });

    return { ok: true as const, linked: result.count };
}

export { getOrder, getOrdersByUser, deleteOrder, claimGuestOrdersForUser };
