export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-6xl animate-bounce">🍿</div>

      <p className="mt-6 text-2xl font-semibold">Grabbing popcorn...</p>

      <p className="mt-2 text-gray-400">The movie is about to start.</p>
    </div>
  );
}
