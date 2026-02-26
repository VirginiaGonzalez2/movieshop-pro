import MovieCard, { type MovieCardItem } from "@/components/movies/MovieCard";

type Props = {
    title: string;
    items: MovieCardItem[];
};

export default function RecommendedMoviesSection({ title, items }: Props) {
    if (!items.length) return null;

    return (
        <div className="border rounded p-6 space-y-4">
            <h2 className="text-xl font-semibold">{title}</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
