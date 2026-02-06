type Props = React.ComponentProps<"h1"> & {
    variant: "header" | "footer";
};

export default function MovieShopLogo({ variant, ...rest }: Props) {
    // TODO: Change to image and style etc etc

    return (
        <h1
            {...rest}
            className={`p-1 border-2 self-center text-nowrap ${variant === "header" ? "border-pink-500 bg-pink-300" : "border-green-500 bg-green-300"} rounded-xl`}>
            A+ MovieShop (PLACEHOLDER LOGO)
        </h1>
    );
}
