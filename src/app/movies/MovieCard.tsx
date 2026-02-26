import Link from "next/link";

type MovieCardProps = {
  movie: {
    id: number;
    title: string;
    price: number;
    stock: number;
    runtime: number;
  };
  actors: string[];
  directors: string[];
};

export default function MovieCard({
  movie,
  actors,
  directors,
}: MovieCardProps) {
  return (
    <div className="border rounded p-4 flex items-start justify-between">
      <div className="space-y-1">
        <div className="font-semibold text-lg">{movie.title}</div>

        <div className="text-sm text-muted-foreground">
          ${movie.price} • Stock: {movie.stock} • Runtime: {movie.runtime} min
        </div>

        <div className="text-sm">
          <span className="font-semibold">Director:</span>{" "}
          {directors.length > 0 ? directors.join(", ") : "—"}
        </div>

        <div className="text-sm">
          <span className="font-semibold">Cast:</span>{" "}
          {actors.length > 0 ? actors.join(", ") : "—"}
        </div>
      </div>

      <div className="text-sm">
        <Link
          href={`/movies/${movie.id}`}
          className="text-blue-600 hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}
