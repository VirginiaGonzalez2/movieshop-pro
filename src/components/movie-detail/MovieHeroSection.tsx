import { PriceTag } from "@/components/ui/PriceTag";
import { RatingStars } from "@/components/ui/RatingStars";

type Props = {
    title: string;
    price: string;
    runtime: number;
    stock: number;
    rating: number;
    imageUrl?: string | null;
};

export default function MovieHeroSection({
    title,
    price,
    runtime,
    stock,
    rating,
    imageUrl,
}: Props) {
    return (
        <div className="border rounded p-6 space-y-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>

                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                    <PriceTag amount={price} />
                    <span>•</span>
                    <span>Runtime: {runtime} min</span>
                    <span>•</span>
                    <span>Stock: {stock}</span>
                </div>

                <RatingStars value={rating} />
            </div>

            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={title} className="w-full max-w-md rounded border" />
            ) : (
                <div className="w-full max-w-md rounded border bg-muted aspect-[2/3] flex items-center justify-center text-sm text-muted-foreground">
                    No Image
                </div>
            )}
        </div>
    );
}
