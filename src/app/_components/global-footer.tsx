type Props = Omit<React.ComponentProps<"footer">, "className"> & {
    className?: string;
};

export default function GlobalFooter({ className }: Props) {
    return (
        <footer className={className}>
            <h1 className="p-2 border-2 self-center border-green-500 bg-green-300 rounded-xl">
                &copy;2026 Team A (FOOTER PLACEHOLDER CONTENT)
            </h1>
        </footer>
    );
}
