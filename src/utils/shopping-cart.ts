import { cookies } from "next/dist/server/request/cookies";

type ShoppingCartItem = {
    id: number;
    qty: number;
};

type ShoppingCart = ShoppingCartItem[];

const shoppingCartCookie = "shopping-cart";
const shoppingCartLifetime = 604800000; // One week.

async function getShoppingCart(): Promise<ShoppingCart | undefined> {
    const cookieStore = await cookies();

    const cookie = cookieStore.get(shoppingCartCookie);
    if (!cookie || !cookie.value) {
        return undefined;
    }

    const parsed = JSON.parse(cookie.value);

    if (!(parsed instanceof Array)) {
        await clearShoppingCart();
        return undefined;
    }

    let save = false;

    let i = parsed.length - 1;
    while (i >= 0) {
        const item = parsed[i];
        if (!(item.id instanceof Number && item.qty instanceof Number && item.qty > 0)) {
            parsed.copyWithin(i, i + 1);
            parsed.pop();
            save = true;
        } else {
            i--;
        }
    }

    if (save) {
        await saveShoppingCart(parsed);
    }

    return parsed;
}

async function saveShoppingCart(shoppingCart: ShoppingCart | null) {
    if (shoppingCart) {
        await cookieStore.set({
            name: shoppingCartCookie,
            value: JSON.stringify(shoppingCart),
            expires: Date.now() + shoppingCartLifetime,
        });
    } else {
        await cookieStore.delete(shoppingCartCookie);
    }
}

function findShoppingCartItem(shoppingCart: ShoppingCart, id: number): ShoppingCartItem | null {
    for (const item of shoppingCart) {
        if (item.id === id) {
            return item;
        }
    }

    return null;
}

async function addShoppingCartItem(item: ShoppingCartItem) {
    let shoppingCart = await getShoppingCart();

    let existing = undefined;

    if (shoppingCart) {
        existing = findShoppingCartItem(shoppingCart, item.id);
    } else {
        shoppingCart = [];
    }

    if (existing) {
        // If it already exists add to quantity.
        existing.qty += item.qty;
    } else {
        shoppingCart.push(item);
    }

    return saveShoppingCart(shoppingCart);
}

async function removeShoppingCartItem(id: number) {
    const shoppingCart = await getShoppingCart();

    if (!shoppingCart) {
        return;
    }

    for (let i = 0; i < shoppingCart.length; i++) {
        const item = shoppingCart[i];
        if (item.id === id) {
            shoppingCart.copyWithin(i - 1, i);
            shoppingCart.pop();
            return saveShoppingCart(shoppingCart);
        }
    }
}

async function clearShoppingCart() {
    return saveShoppingCart(null);
}

export {
    addShoppingCartItem,
    clearShoppingCart,
    getShoppingCart,
    removeShoppingCartItem,
    type ShoppingCart,
    type ShoppingCartItem,
};
