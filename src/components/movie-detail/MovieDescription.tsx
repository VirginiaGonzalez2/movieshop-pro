type Props = {
    description: string;
};

export default function MovieDescription({ description }: Props) {
    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
            </p>
        </div>
    );
}
