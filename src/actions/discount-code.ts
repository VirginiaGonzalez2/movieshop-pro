"use server";

import { requireAdminArea } from "@/lib/admin-rbac";
import { prisma } from "@/lib/prisma";
import { discountCodeSchema } from "@/lib/validations/discount-code";
import { DiscountScope, DiscountType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateDiscountRelatedPaths(discountCodeId?: number) {
    revalidatePath("/admin");
    revalidatePath("/admin/discount-codes");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/movies");

    if (discountCodeId) {
        revalidatePath(`/admin/discount-codes/${discountCodeId}/edit`);
    }
}

function readSelectedMovieIds(formData: FormData): number[] {
    return formData
        .getAll("movieIds")
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0);
}

function parseIsActive(formData: FormData): boolean {
    return formData.get("isActive") === "on";
}

function parseDiscountForm(formData: FormData) {
    const raw = {
        code: String(formData.get("code") ?? ""),
        type: String(formData.get("type") ?? "") as DiscountType,
        value: String(formData.get("value") ?? "0"),
        scope: String(formData.get("scope") ?? "") as DiscountScope,
        startsAt: String(formData.get("startsAt") ?? ""),
        endsAt: String(formData.get("endsAt") ?? ""),
        usageLimit: String(formData.get("usageLimit") ?? ""),
    };

    const parsed = discountCodeSchema.safeParse(raw);
    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((issue) => issue.message).join(" "));
    }

    const selectedMovieIds = readSelectedMovieIds(formData);
    if (parsed.data.scope === DiscountScope.SELECTED_PRODUCTS && selectedMovieIds.length === 0) {
        throw new Error("Select at least one movie when using selected products scope.");
    }

    return {
        code: parsed.data.code.toUpperCase(),
        type: parsed.data.type,
        value: new Prisma.Decimal(parsed.data.value),
        scope: parsed.data.scope,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
        usageLimit:
            parsed.data.usageLimit === undefined ? null : Number(parsed.data.usageLimit),
        isActive: parseIsActive(formData),
        selectedMovieIds,
    };
}

export async function createDiscountCode(formData: FormData): Promise<void> {
    await requireAdminArea("discounts");

    const parsed = parseDiscountForm(formData);

    try {
        await prisma.discountCode.create({
            data: {
                code: parsed.code,
                type: parsed.type,
                value: parsed.value,
                scope: parsed.scope,
                startsAt: parsed.startsAt,
                endsAt: parsed.endsAt,
                usageLimit: parsed.usageLimit,
                isActive: parsed.isActive,
                products:
                    parsed.scope === DiscountScope.SELECTED_PRODUCTS
                        ? {
                              createMany: {
                                  data: parsed.selectedMovieIds.map((movieId) => ({ movieId })),
                                  skipDuplicates: true,
                              },
                          }
                        : undefined,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("A discount code with that value already exists.");
        }

        throw error;
    }

    revalidateDiscountRelatedPaths();
    redirect("/admin/discount-codes");
}

export async function updateDiscountCode(id: number, formData: FormData): Promise<void> {
    await requireAdminArea("discounts");

    const parsed = parseDiscountForm(formData);

    try {
        await prisma.$transaction(async (tx) => {
            await tx.discountCode.update({
                where: { id },
                data: {
                    code: parsed.code,
                    type: parsed.type,
                    value: parsed.value,
                    scope: parsed.scope,
                    startsAt: parsed.startsAt,
                    endsAt: parsed.endsAt,
                    usageLimit: parsed.usageLimit,
                    isActive: parsed.isActive,
                },
            });

            await tx.discountCodeMovie.deleteMany({ where: { discountCodeId: id } });

            if (
                parsed.scope === DiscountScope.SELECTED_PRODUCTS &&
                parsed.selectedMovieIds.length > 0
            ) {
                await tx.discountCodeMovie.createMany({
                    data: parsed.selectedMovieIds.map((movieId) => ({
                        discountCodeId: id,
                        movieId,
                    })),
                    skipDuplicates: true,
                });
            }
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("A discount code with that value already exists.");
        }

        throw error;
    }

    revalidateDiscountRelatedPaths(id);
    redirect("/admin/discount-codes");
}

export async function deleteDiscountCode(id: number): Promise<void> {
    await requireAdminArea("discounts");

    await prisma.discountCode.delete({ where: { id } });

    revalidateDiscountRelatedPaths(id);
}

export async function toggleDiscountCodeActive(id: number): Promise<void> {
    await requireAdminArea("discounts");

    const existing = await prisma.discountCode.findUnique({
        where: { id },
        select: { isActive: true },
    });

    if (!existing) {
        throw new Error("Discount code not found.");
    }

    await prisma.discountCode.update({
        where: { id },
        data: { isActive: !existing.isActive },
    });

    revalidateDiscountRelatedPaths(id);
}
