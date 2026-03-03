import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    ...defaultStatements,
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
