type Props = {
    description: string;
};

export default function MovieDescription({ description }: Props) {
    return (
        <div className="border rounded p-6">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
