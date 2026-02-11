import { cookies } from "next/dist/server/request/cookies";

type ShoppingCartItem = {
    id: number;
    quantity: number;
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
        clearShoppingCart();
        return undefined;
    }

    // TODO: Check for and remove invalid items.

    return parsed;
}

async function saveShoppingCart(shoppingCart: ShoppingCart | null) {
    if (shoppingCart) {
        cookieStore.set({
            name: shoppingCartCookie,
            value: JSON.stringify(shoppingCart),
            expires: Date.now() + shoppingCartLifetime,
        });
    } else {
        cookieStore.delete(shoppingCartCookie);
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

function addShoppingCartItem(item: ShoppingCartItem) {
    getShoppingCart().then((shoppingCart) => {
        let existing = undefined;

        if (shoppingCart) {
            existing = findShoppingCartItem(shoppingCart, item.id);
        } else {
            shoppingCart = [];
        }

        if (existing) {
            // If it already exists add to quantity.
            existing.quantity += item.quantity;
        } else {
            shoppingCart.push(item);
        }

        saveShoppingCart(shoppingCart);
    });
}

function removeShoppingCartItem(id: number): void {
    getShoppingCart().then((shoppingCart) => {
        if (!shoppingCart) {
            return;
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
    });
}

function clearShoppingCart() {
    saveShoppingCart(null);
}

export {
    getShoppingCart,
    addShoppingCartItem,
    removeShoppingCartItem,
    clearShoppingCart,
    type ShoppingCart,
};
