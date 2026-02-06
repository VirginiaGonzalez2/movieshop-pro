import MovieShopLogo from "@/components/ui-brand/movieshop-logo";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"header">;

export default function GlobalHeader({ className, ...headerProps }: Props) {
    return (
        <header
            className={twMerge(
                "w-full flex flex-row justify-between",
                className,
            )}
            {...headerProps}>
            <MovieShopLogo variant="header" className="flex-0" />
            <NavigationMenu className="flex-0">
                <NavigationMenuList className="w-full flex-1 justify-end">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/movies">
                            Movies
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/orders">
                            Orders
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/about">
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuIcon
                            // href="/cart"
                            src="/shopping-cart.png"
                            alt="Cart"
                        />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuIcon
                            // href="/#TODO_USER_PAGE_OR_DROPDOWN
                            src="/user.png"
                            alt="User"
                        />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
}

const NavigationMenuIcon = (props: {
    src: string | StaticImport;
    href?: string;
    alt: string;
    iconSize?: number;
}) => (
    <NavigationMenuLink className="rounded-full" href={props.href}>
        <Image
            className="m-auto max-w-none"
            loading="eager"
            src={props.src}
            alt={props.alt}
            width={20}
            height={20}
        />
    </NavigationMenuLink>
);
