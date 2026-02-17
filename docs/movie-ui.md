# Movie UI Components — MovieShop

This document explains the Movie UI layer used across the project.

These components are responsible for displaying movies consistently across:
- Movies page
- Genre browsing
- Search results
- Movie details navigation

This follows the team guideline:
"Global components should be reusable and consistent across pages."

---

## MovieCard Component

Location:
src/components/movies/MovieCard.tsx


Used in:
- `/movies`
- `/genres/[id]`
- `/search`
- future homepage sections

Responsibility:
- Display movie poster
- Display title
- Display price
- Display runtime
- Display stock
- Display rating stars
- Navigate to `/movies/[id]`

This is the **single reusable movie preview component** in the project.

---

## MovieCard Data Shape

MovieCard expects this structure:

```ts
export type MovieCardItem = {
  id: number;
  title: string;
  price: string;
  stock: number;
  runtime: number;
  rating: number;
  imageUrl?: string | null;
};
```
MovieCard should map database movies into this shape.

## Movie Page
Location: 
src/app/movies/page.tsx

Responsibility:
- Fetch movies from Prisma
- Fetch actors and directors
- Map movies into MovieCardItem
- Render MoviesClient

## MoviesClient
Location:
src/app/movies/movies-client.tsx

Responsibilities:
- Client-side search filtering
- Render MovieCard list
- Use SearchInput
- Use PriceTag
- Use RatingStars

## Genre Browsing
Locations:
src/app/genres/page.tsx
src/app/genres/[id]/page.tsx

Responsibilities:
- List genres
- Show movies inside a genre
- Use MovieCard for display

## Movie Image Upload
Images are stored in:
/public/uploads/

Database stores:
imageUrl: "/uploads/<filename>.jpg"

## NOTE:
If MovieCard changes:
- All pages using it will be affected
- Update this document
- Inform the team
MovieCard is now part of the shared UI system.