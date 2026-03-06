import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { ac, admin, user } from "./auth-role-permissions";

// Added this to solve some issues I have personally ran into
// on a separate project. /Sabrina
const development = process.env.NODE_ENV == "development";

export const auth = betterAuth({
    plugins: [
        adminPlugin({
            ac,
            roles: {
                admin,
                user,
            },
        }),
    ],

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: !development
        ? //[
          // Production
          undefined
        : //]
          [
              // Development
              "http://localhost:3000",
          ],

    emailAndPassword: {
        enabled: true,
        // TODO: Change this to test e-mail verification.
        requireEmailVerification: false, //!development,
        sendResetPassword: async (data: { url: string }) => {
            console.log("Password Reset:", data.url);
        },
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
