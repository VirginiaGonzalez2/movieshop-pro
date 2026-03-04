type Props = {
    trailerUrl?: string | null;
    title: string;
};

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);

        if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
            return u.toString();
        }

        let videoId: string | null = null;
        let start: string | null = null;

        if (u.hostname === "youtu.be") {
            videoId = u.pathname.replace("/", "").trim() || null;
            start = u.searchParams.get("t");
        } else if (u.hostname.includes("youtube.com")) {
            videoId = u.searchParams.get("v");
            start = u.searchParams.get("start") ?? u.searchParams.get("t");
        }

        if (!videoId) return null;

        const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
        embed.searchParams.set("rel", "0");
        embed.searchParams.set("modestbranding", "1");
        embed.searchParams.set("playsinline", "1");

        if (start) {
            const startSeconds = String(parseInt(start, 10));
            if (!Number.isNaN(Number(startSeconds))) embed.searchParams.set("start", startSeconds);
        }

        return embed.toString();
    } catch {
        return null;
    }
}

export default function MovieTrailerSection({ trailerUrl, title }: Props) {
    if (!trailerUrl) return null;

    const embedUrl = getYouTubeEmbedUrl(trailerUrl);

    return (
        <section id="trailer" className="space-y-3">
            <h2 className="text-2xl font-bold">Trailer</h2>

            {embedUrl ? (
                <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                        <iframe
                            className="absolute left-0 top-0 h-full w-full"
                            src={embedUrl}
                            title={`${title} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl bg-white shadow-sm p-4 text-sm">
                    <div className="font-medium">Trailer link</div>
                    <a
                        href={trailerUrl}
                        className="text-blue-600 underline break-all"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {trailerUrl}
                    </a>
                    <div className="mt-2 text-xs text-muted-foreground">
                        This trailer can’t be embedded here, so it will open in a new tab.
                    </div>
                </div>
            )}
        </section>
    );
}
