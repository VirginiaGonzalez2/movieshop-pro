"use server";

import { prisma } from "@/lib/prisma";

export async function claimGuestOrdersForUser(email: string, name: string) {
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
