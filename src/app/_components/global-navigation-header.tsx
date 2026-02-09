import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

type Props = Omit<React.ComponentProps<typeof NavigationMenu>, "className"> & {
    className?: string;
};

export default function GlobalNavigationHeader({ className }: Props) {
    return (
        <header className={className}>
            <NavigationMenu>
                <h1 className="mr-4 p-1 border-2 self-center border-pink-500 bg-pink-300 rounded-xl">
                    A+ MovieShop (PLACEHOLDER LOGO)
                </h1>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/"
                            className="navigationMenuTriggerStyle()">
                            Home
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/movies"
                            className="navigationMenuTriggerStyle()">
                            Movies
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/orders"
                            className="navigationMenuTriggerStyle()">
                            Orders
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/cart"
                            className="navigationMenuTriggerStyle()">
                            Cart
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/about"
                            className="navigationMenuTriggerStyle()">
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
}
