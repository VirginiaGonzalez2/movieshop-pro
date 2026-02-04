import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type Props = Omit<React.ComponentProps<typeof NavigationMenu>, "className"> & {
    className?: string;
};

export default function GlobalNavigationHeader({ className }: Props) {
    return (
        <NavigationMenu className={className}>
            <h1 className="mr-4 p-1 border-2 self-center border-pink-500 bg-pink-300 rounded-xl">
                A+ MovieShop (PLACEHOLDER LOGO)
            </h1>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className="navigationMenuTriggerStyle()">
                        <Link href="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className="navigationMenuTriggerStyle()">
                        <Link href="/movies">Movies</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className="navigationMenuTriggerStyle()">
                        <Link href="/orders">Orders</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className="navigationMenuTriggerStyle()">
                        <Link href="/cart">Cart</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className="navigationMenuTriggerStyle()">
                        <Link href="/about">About</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
