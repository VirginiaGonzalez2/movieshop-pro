import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    ...defaultStatements,
    movies: ["create", "get", "edit", "delete"],
    genres: ["create", "get", "edit", "delete"],
    people: ["create", "get", "edit", "delete"],
    orders: ["create", "get", "get-own", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    orders: ["get-own"],
});

export const admin = ac.newRole({
    // Give admin all privileges
    orders: [...statement.orders],
    ...adminAc.statements,
});

export const catalogAdmin = ac.newRole({
    movies: [...statement.movies],
    genres: [...statement.genres],
    people: [...statement.people],
    orders: ["get"],
});

export const ordersAdmin = ac.newRole({
    orders: [...statement.orders],
});

export const supportAdmin = ac.newRole({
    orders: ["get", "get-own"],
});
