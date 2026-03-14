import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { ac, admin, catalogAdmin, ordersAdmin, supportAdmin, user } from "./auth-role-permissions";

// Added this to solve some issues I have personally ran into
// on a separate project. /Sabrina
const development = process.env.NODE_ENV == "development";

export const auth = betterAuth({
    plugins: [
        adminPlugin({
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

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins:
        process.env.NODE_ENV === "production"
            ? process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") || []
            : ["http://localhost:3000"],
    cookies: {
        secure: true,
        sameSite: "lax"
    },

    emailAndPassword: {
        enabled: true,
    },

    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async (data: { url: string }) => {
            console.log("Email Verification:", data.url);
        },
    },
});
