"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-6">
      <h1 className="text-4xl font-bold text-red-500">
        💥 The Projector Exploded!
      </h1>

      <p className="mt-4 text-gray-400 max-w-md">
        Something went terribly wrong backstage. Our film crew is fixing it.
      </p>

      <p className="mt-2 text-gray-500 italic">
        “We swear this never happens…”
      </p>

      <button
        onClick={() => reset()}
        className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
      >
        🎬 Retry Scene
      </button>
    </div>
  );
}
