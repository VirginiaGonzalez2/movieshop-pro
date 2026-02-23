import MovieCard from "@/components/movies/MovieCard";

export type RecommendedMovieItem = {
    id: number;
    title: string;
    price: string;
    stock: number;
    runtime: number;
    rating: number;
    imageUrl?: string | null;
};

type Props = {
    items: RecommendedMovieItem[];
};

export default function RecommendedMoviesSection({ items }: Props) {
    if (items.length === 0) return null;

    return (
        <div className="border rounded p-6 space-y-4">
            <h2 className="text-xl font-semibold">Recommended Movies</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
