import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, catalogAdmin, ordersAdmin, supportAdmin, user } from "./auth-role-permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                admin,
                catalog_admin: catalogAdmin,
                orders_admin: ordersAdmin,
                support_admin: supportAdmin,
                user,
            },
        }),
    ],
});
