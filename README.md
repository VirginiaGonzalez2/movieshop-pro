This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, navigate to a suitable folder and open a terminal.

Then run the following commands:

```bash
git clone git@github.com:Gr-25-16/a-plus-movieshop.git MovieShop
cd MovieShop

npm install
```

Create a file named .env and add the following to it:

```
# Replace postgres:postgres with your postgres username and password.
DATABASE_URL="postgres://postgres:postgres@localhost:5432/MovieShopDB?schema=public"

# Go here to generate a unique secret: https://www.better-auth.com/docs/installation#set-environment-variables
BETTER_AUTH_SECRET=<REPLACE WITH UNIQUE 32-BYTE BASE64-ENCODED SECRET>
BETTER_AUTH_URL=http://localhost:3000

# Optional (recommended for production distributed rate limiting in middleware)
UPSTASH_REDIS_REST_URL=<YOUR_UPSTASH_REDIS_REST_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_UPSTASH_REDIS_REST_TOKEN>

# PayPal Sandbox (client-side checkout button)
# Use "sb" for quick sandbox testing without creating a PayPal app.
NEXT_PUBLIC_PAYPAL_CLIENT_ID=sb
# Optional (only needed if/when you add server-side PayPal API verification)
PAYPAL_CLIENT_SECRET=<YOUR_PAYPAL_SANDBOX_CLIENT_SECRET>
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Initialize Prisma and seed the database.

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# MovieShopProyect

## Setup rápido para copias, plantillas y Vercel

Este proyecto está listo para ser copiado, clonado o desplegado en Vercel. Para evitar errores con Prisma y la base de datos, sigue estos pasos:

### 1. Instala dependencias
```
npm install
```

### 2. Genera el cliente Prisma
```
npx prisma generate
```

### 3. Aplica migraciones (crea tablas)
```
npx prisma migrate dev
```

### 4. (Opcional) Ejecuta el seed
```
npx tsx prisma/seed.ts
```

### 5. Arranca el proyecto
```
npm run dev
```

### 6. Para producción/Vercel
- Vercel ejecuta automáticamente `npx prisma generate` en el build.
- Si usas una base de datos externa, configura `DATABASE_URL` en `.env` o en Vercel.

---

## Notas importantes
- Si ves errores como `findMany undefined`, asegúrate de haber ejecutado `npx prisma generate` y reiniciado el servidor.
- El modelo `IntegrationConfig` está listo para integraciones futuras.
- Puedes agregar un dominio fácilmente en Vercel o VPS siguiendo las instrucciones del README.

---

## Scripts útiles
Agrega estos scripts en tu `package.json` para automatizar:

```json
"scripts": {
  "prisma:generate": "npx prisma generate",
  "prisma:migrate": "npx prisma migrate dev",
  "prisma:seed": "npx tsx prisma/seed.ts"
}
```

Así puedes correr:
```
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
