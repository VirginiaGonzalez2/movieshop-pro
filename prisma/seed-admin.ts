import "dotenv/config";
import { prisma } from "@/lib/prisma";

// Crea o actualiza el usuario admin adicional
const adminUser2 = await prisma.user.upsert({
    where: { email: "marisilva703@gmail.com" },
    update: { role: "admin", updatedAt: new Date() },
    create: {
        id: "user-marisi",
        name: "Marisi Silva",
        email: "marisilva703@gmail.com",
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
});

await prisma.account.upsert({
    where: { id: "acc-marisi" },
    update: { password: "Exito2026#", updatedAt: new Date() },
    create: {
        id: "acc-marisi",
        accountId: "marisilva703@gmail.com",
        providerId: "email",
        userId: adminUser2.id,
        password: "Exito2026#",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
});

async function main() {
    // Crea o actualiza el usuario admin
    const adminUser = await prisma.user.upsert({
        where: { email: "virginiagonzzalez@gmail.com" },
        update: { role: "admin", updatedAt: new Date() },
        create: {
            id: "user-virginia",
            name: "Virginia Gonzalez",
            email: "virginiagonzzalez@gmail.com",
            emailVerified: true,
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    // Crea o actualiza la cuenta asociada con contraseña
    await prisma.account.upsert({
        where: { id: "acc-virginia" },
        update: { password: "Exito2026#", updatedAt: new Date() },
        create: {
            id: "acc-virginia",
            accountId: "virginiagonzzalez@gmail.com",
            providerId: "email",
            userId: adminUser.id,
            password: "Exito2026#",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log("✅ Usuario admin creado con contraseña Exito2026#");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
