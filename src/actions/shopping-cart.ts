/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-12 08:45:41
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 16:52:10
 * @ Description: Shopping cart actions.
 */

"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { applyDealDiscountToPrice } from "@/actions/deal-of-the-day";

type ShoppingCartItem = {
    id: number;
    qty: number;
};

const shoppingCartCookie = "shopping-cart";
const shoppingCartLifetime = 7 * 24 * 3600 * 1000; // One week.

/**
 * Gets the shopping cart.
 * @returns Array of ShoppingCartItem objects which include id and quantity (qty),
 * or null if the shopping cart is empty.
 */
async function getShoppingCart(): Promise<ShoppingCartItem[] | null> {
    const cookieStore = await cookies();

    const cookie = cookieStore.get(shoppingCartCookie);
    if (!cookie || !cookie.value) {
        return null;
    }

    try {
        const parsed: ShoppingCartItem[] = JSON.parse(cookie.value);

        if (!(parsed instanceof Array)) {
            cookieStore.delete(shoppingCartCookie);
            return null;
        }

        return parsed;
    } catch (error) {
        console.log("Failed to JSON parse shopping cart. Error:", error);
    }

    return null;
}

/**
 * Saves the shopping cart. Will overwrite any existing saved shopping cart.
 * @param shoppingCart Array of ShoppingCartItem.
 */
async function saveShoppingCart(shoppingCart: ShoppingCartItem[]) {
    const cookieStore = await cookies();
    if (shoppingCart.length > 0) {
        try {
            cookieStore.set(shoppingCartCookie, JSON.stringify(shoppingCart), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: Date.now() + shoppingCartLifetime,
            });
        } catch (error) {
            cookieStore.delete(shoppingCartCookie);
            console.log("Failed to JSON stringify shopping cart. Error:", error);
        }
    } else {
        cookieStore.delete(shoppingCartCookie);
    }
}

function findShoppingCartItem(
    shoppingCart: ShoppingCartItem[],
    id: number,
): ShoppingCartItem | null {
    for (const item of shoppingCart) {
        if (item.id === id) {
            return item;
        }
    }

    return null;
}

function modifyShoppingCartItem(
    shoppingCart: ShoppingCartItem[],
    itemId: number,
    quantity: number,
    set: boolean = false,
): ShoppingCartItem {
    let item = findShoppingCartItem(shoppingCart, itemId);

    if (item) {
        if (set) {
            item.qty = quantity;
        } else {
            item.qty += quantity;
        }
        return item;
    }

    item = { id: itemId, qty: quantity };
    shoppingCart.push(item);
    return item;
}

/**
 * Add an item or update the quantity of an item.
 * @param itemId Movie ID.
 * @param quantity (Optional) Number of items to add. Defaults to 1.
 * @returns New quantity of the item.
 */
async function addShoppingCartItem(itemId: number, quantity: number = 1): Promise<number> {
    if (quantity < 0) {
        return removeShoppingCartItem(itemId, -quantity);
    }

    const shoppingCart = (await getShoppingCart()) ?? [];

    const item = modifyShoppingCartItem(shoppingCart, itemId, quantity);

    await saveShoppingCart(shoppingCart);

    return item.qty;
}

/**
 * Remove or update the quantity of an item.
 * @param itemId
 * @param quantity (Optional) Number of items to remove. "all" will remove all items. Defaults to 1.
 * @returns New quantity of the item.
 */
async function removeShoppingCartItem(
    itemId: number,
    quantity: number | "all" = 1,
): Promise<number> {
    if (quantity !== "all" && quantity < 0) {
        return addShoppingCartItem(itemId, -quantity);
    }

    const shoppingCart = await getShoppingCart();

    if (!shoppingCart) {
        return 0;
    }

    for (let i = 0; i < shoppingCart.length; i++) {
        const item = shoppingCart[i];
        if (item.id === itemId) {
            if (quantity !== "all") {
                item.qty -= quantity;
            } else {
                item.qty = 0;
            }

            if (item.qty <= 0) {
                shoppingCart.copyWithin(i, i + 1);
                shoppingCart.pop();
            }

            await saveShoppingCart(shoppingCart);

            return item.qty;
        }
    }

    return 0;
}

/**
 * Set the quantity of an item.
 * @param itemId If the item does not exist, it will be added.
 * @param newQuantity If 0 the item will be removed.
 */
async function updateShoppingCartItem(itemId: number, newQuantity: number) {
    if (newQuantity <= 0) {
        await removeShoppingCartItem(itemId, "all");
        return;
    }

    const shoppingCart = (await getShoppingCart()) ?? [];

    modifyShoppingCartItem(shoppingCart, itemId, newQuantity, true);

    await saveShoppingCart(shoppingCart);
}

/**
 * Gets the current quantity of an item in the shopping cart.
 * @param itemId
 * @returns The quantity of itemId stored in the shopping cart.
 */
async function getShoppingCartItemQuantity(itemId: number): Promise<number> {
    const shoppingCart = await getShoppingCart();

    if (!shoppingCart) {
        return 0;
    }

    const item = findShoppingCartItem(shoppingCart, itemId);

    return item ? item.qty : 0;
}

async function clearShoppingCart() {
    const cookieStore = await cookies();
    cookieStore.delete(shoppingCartCookie);
}

type ShoppingCartItemInfo = {
    itemId: number;
    quantity: number;
    title: string;
    imageUrl: string | null;
    genres: string[];
    originalPrice: number;
    price: number;
    isDealApplied: boolean;
    stock: number;
};

/**
 * Gets the shopping cart and also information about the movies added to it.
 * @returns Array of ShoppingCartItemInfo objects. See the ShoppingCartItemInfo
 * type for more information about what is included.
 */
async function getShoppingCartInfo(): Promise<ShoppingCartItemInfo[] | null> {
    const shoppingCart = await getShoppingCart();

    if (!shoppingCart) {
        return null;
    }

    const shoppingCartInfo: ShoppingCartItemInfo[] = [];

    for (let i = 0; i < shoppingCart.length; i++) {
        const item = shoppingCart[i];

        const movie = await prisma.movie.findFirst({
            select: {
                title: true,
                price: true,
                imageUrl: true,
                stock: true,
                genres: {
                    select: { genre: { select: { name: true } } },
                    where: { movieId: item.id },
                },
            },
            where: { id: item.id },
        });

        if (!movie) {
            continue;
        }

        const basePrice = movie.price.toNumber();
        const finalPrice = await applyDealDiscountToPrice(item.id, basePrice);

        shoppingCartInfo.push({
            itemId: item.id,
            quantity: item.qty,
            title: movie.title,
            imageUrl: movie.imageUrl,
            genres: movie.genres.map((value) => value.genre.name).flat(),
            originalPrice: basePrice,
            price: finalPrice,
            isDealApplied: finalPrice < basePrice,
            stock: movie.stock,
        });
    }

    return shoppingCartInfo.length > 0 ? shoppingCartInfo : null;
}

export {
    addShoppingCartItem,
    clearShoppingCart,
    getShoppingCart,
    getShoppingCartInfo,
    getShoppingCartItemQuantity,
    removeShoppingCartItem,
    updateShoppingCartItem,
    type ShoppingCartItem,
    type ShoppingCartItemInfo,
};
