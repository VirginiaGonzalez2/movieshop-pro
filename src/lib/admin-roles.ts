export type AdminArea =
    | "overview"
    | "movies"
    | "discounts"
    | "genres"
    | "people"
    | "orders"
    | "messages"
    | "users"
    | "promo";

export const adminRoleLabels: Record<string, string> = {
    admin: "Super Admin",
    catalog_admin: "Catalog Admin",
    orders_admin: "Orders Admin",
    support_admin: "Support Admin",
};

const allAreas: AdminArea[] = [
    "overview",
    "movies",
    "discounts",
    "genres",
    "people",
    "orders",
    "messages",
    "users",
    "promo",
];

export const adminRoleAreas: Record<string, AdminArea[]> = {
    admin: allAreas,
    catalog_admin: ["overview", "movies", "discounts", "genres", "people", "promo"],
    orders_admin: ["overview", "orders", "promo"],
    support_admin: ["overview", "messages", "promo"],
};

export function normalizeUserRole(role: string | null | undefined): string {
    return (role ?? "user").trim().toLowerCase();
}

export function isAdminRole(role: string | null | undefined): boolean {
    const normalized = normalizeUserRole(role);
    return normalized in adminRoleAreas;
}

export function getAreasForRole(role: string | null | undefined): AdminArea[] {
    const normalized = normalizeUserRole(role);
    return adminRoleAreas[normalized] ?? [];
}

export function hasAdminArea(role: string | null | undefined, area: AdminArea): boolean {
    return getAreasForRole(role).includes(area);
}
