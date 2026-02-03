import { getLocalCookieStore } from "./cookie-store";

type ShoppingCartItem = {
    id: number;
    quantity: number;
};

const shoppingCartCookie = "shopping-cart";

function saveShoppingCart(shoppingCart: ShoppingCartItem[] | null): boolean {
    const storage = getLocalCookieStore();
    if (!storage) {
        return false;
    }

    if (shoppingCart) {
        storage.setItem(shoppingCartCookie, JSON.stringify(shoppingCart));
    } else {
        storage.removeItem(shoppingCartCookie);
    }

    return true;
}

function getShoppingCart(): ShoppingCartItem[] | undefined {
    const storage = getLocalCookieStore();
    if (!storage) {
        return undefined;
    }

    const cookie = storage.getItem(shoppingCartCookie);
    if (!cookie) {
        return [];
    }

    return JSON.parse(cookie.toString());
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

function addShoppingCartItem(
    item: ShoppingCartItem,
): ShoppingCartItem[] | undefined {
    const shoppingCart = getShoppingCart();
    if (!shoppingCart) {
        return undefined;
    }

    const existing = findShoppingCartItem(shoppingCart, item.id);

    if (existing) {
        // If it already exists add to quantity.
        existing.quantity += item.quantity;
    } else {
        shoppingCart.push(item);
    }

    saveShoppingCart(shoppingCart);

    return shoppingCart;
}

function removeShoppingCartItem(id: number): ShoppingCartItem[] | undefined {
    const shoppingCart = getShoppingCart();
    if (!shoppingCart) {
        return undefined;
    }

    for (let i = 0; i < shoppingCart.length; i++) {
        const item = shoppingCart[i];
        if (item.id === id) {
            shoppingCart.copyWithin(i - 1, i);
            shoppingCart.pop();
            saveShoppingCart(shoppingCart);
            break;
        }
    }

    return shoppingCart;
}

function updateShoppingCartItem(
    id: number,
    quantity: number,
): ShoppingCartItem[] | undefined {
    const shoppingCart = getShoppingCart();
    if (!shoppingCart) {
        return undefined;
    }

    for (const item of shoppingCart) {
        if (item.id === id) {
            item.quantity = quantity;
            saveShoppingCart(shoppingCart);
            break;
        }
    }

    return shoppingCart;
}

function clearShoppingCart(): boolean {
    return saveShoppingCart(null);
}

export {
    getShoppingCart,
    addShoppingCartItem,
    removeShoppingCartItem,
    updateShoppingCartItem,
    clearShoppingCart,
};
