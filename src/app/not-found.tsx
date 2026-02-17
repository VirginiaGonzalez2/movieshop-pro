import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-7xl font-black">404</h1>

      <p className="mt-4 text-2xl">Plot twist… this page doesn’t exist.</p>

      <p className="mt-2 text-muted-foreground">
        Even our best director couldn’t find this movie.
      </p>

      <Link
        href="/movies"
        className="mt-6 inline-block px-6 py-3 rounded-lg bg-black text-white hover:opacity-90 transition"
      >
        🍿 Browse Movies Instead
      </Link>
    </div>
  );
}
