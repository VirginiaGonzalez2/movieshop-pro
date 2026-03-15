import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const development = process.env.NODE_ENV !== "production";

export const auth = betterAuth({
  adapter: prismaAdapter(prisma, {
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
  secret: process.env.BETTER_AUTH_SECRET!,
});
