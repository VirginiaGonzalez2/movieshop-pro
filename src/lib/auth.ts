import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const development = process.env.NODE_ENV == "development";

export const auth = betterAuth({
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
        requireEmailVerification: !development,
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
