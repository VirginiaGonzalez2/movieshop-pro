import Link from "next/link";

type Props = {
    trailerUrl?: string | null;
    title: string;
};

export default function MovieTrailerSection({ trailerUrl, title }: Props) {
    if (!trailerUrl) return null;

    return (
        <div className="border rounded p-6 space-y-3">
            <h2 className="text-xl font-semibold">Trailer</h2>

            <p className="text-sm text-muted-foreground">Opens YouTube in a new tab.</p>

            <Link
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded bg-black px-4 py-2 text-white text-sm"
            >
                Watch Trailer ↗
            </Link>

            <p className="text-xs text-muted-foreground break-all">
                {title} — {trailerUrl}
            </p>
        </div>
    );
}
