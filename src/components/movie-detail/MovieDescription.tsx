type Props = {
    description: string;
};

export default function MovieDescription({ description }: Props) {
    return (
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
        </p>
    );
}
