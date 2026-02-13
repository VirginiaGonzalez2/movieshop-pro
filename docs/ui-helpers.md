# UI Helpers Documentation
MovieShop, Shared UI Components

This document explains the reusable UI helper components created for this project and how they are used.

These components provide shared UI logic so multiple pages can stay consistent and avoid duplication.

...

## SearchInput
Location:
src/components/ui/SearchInput.tsx

Purpose:
Reusable search input component with a search icon.

It emits the typed value through `onValueChange`, allowing pages to implement filtering or search logic.

Example:
<SearchInput onValueChange={(value) => setQuery(value)} />

Used in:
- Movies page search
- Future search pages
- Filters
- Navigation search

...

## RatingStars
Location:
src/components/ui/RatingStars.tsx

Purpose:
Displays star ratings (0–5).

Supports:
- display-only mode
- interactive mode via `onChange`

Example:
<RatingStars value={4} />

Note:
Currently used with a demo rating until ratings are added to the database.

...

## PriceTag
Location:
src/components/ui/PriceTag.tsx

Purpose:
Formats currency values consistently using `Intl.NumberFormat`.

Default configuration:
- currency: SEK
- locale: sv-SE

Example:
<PriceTag amount={movie.price} />

Why this exists:
Avoid repeating currency formatting logic across pages.

...

## Movies Page Structure
Server component:
src/app/movies/page.tsx

Responsible for:
- fetching movies from Prisma
- loading actors/directors
- preparing serializable data

Client component:
src/app/movies/movies-client.tsx

Responsible for:
- search state
- filtering movies
- rendering UI

Search wrapper:
src/app/movies/search-bar.tsx

This separation follows Next.js App Router best practices.

...

## MovieCard (Reusable Movie Preview)
Location:
src/components/movies/MovieCard.tsx

Purpose:
Reusable movie preview component.

Displays:
- title
- formatted price
- runtime
- stock
- cast
- director
- rating

Navigates to:
/movies/[movieId]

Intended usage:
- Home page
- Movies list
- Genre browsing
- Search results
- Deal of the Day

...

## Safety Notes
These changes:
- do not modify backend logic
- do not change the database schema
- are additive and reusable
- follow the global components reference
