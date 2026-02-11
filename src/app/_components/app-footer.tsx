/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-04
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-09 14:51:22
 *  Description: Footer
 */

import MovieShopLogo from "@/components/ui-brand/movieshop-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"footer">;

export function AppFooter({ className, ...rest }: Props) {
    return (
        <footer
            className={twMerge(
                "p-1 flex-0 flex justify-between items-center bg-foreground text-nowrap",
                className
            )}
            {...rest}
        >
            <div className="flex-1">
                <MovieShopLogo variant="footer" />
            </div>
            <div className="flex-1 flex flex-col items-center">
                <Menu className="gap-2">
                    <MenuButton href={undefined}>Quick Links</MenuButton>
                    <MenuSeparator />
                    <MenuButton href={undefined}>Support</MenuButton>
                    <MenuSeparator />
                    <MenuButton href={undefined}>Blog</MenuButton>
                    <MenuSeparator />
                    <MenuButton href={undefined}>Forum</MenuButton>
                    <MenuSeparator />
                    <MenuButton href={undefined}>FAQs</MenuButton>
                </Menu>
                <p className="text-muted">&copy;2026 MovieShop</p>
            </div>
            <Menu className="gap-2 flex-1 justify-end">
                <SocialMediaButton
                    href={undefined}
                    src="/social-media/facebook.png"
                    alt="Facebook"
                />
                <SocialMediaButton
                    href={undefined}
                    src="/social-media/tiktok.png"
                    alt="TikTok"
                />
                <SocialMediaButton
                    href={undefined}
                    src="/social-media/twitter.png"
                    alt="X (formerly known as Twitter)"
                />
                <SocialMediaButton
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    src="/social-media/youtube.png"
                    alt="YouTube"
                />
            </Menu>
        </footer>
    );
}

const Menu = ({ className, children, ...rest }: React.ComponentProps<"ul">) => (
    <ul
        className={twMerge(
            "flex flex-nowrap items-center justify-start",
            className
        )}
        {...rest}
    >
        {children}
    </ul>
);

const MenuSeparator = () => (
    <Separator orientation="vertical" className="h-full bg-white text-white" />
);

const MenuButton = (props: { href?: string; children: ReactNode }) => (
    <Button asChild variant="link" className="text-background" type="button">
        <Link href={props.href ?? "#FAKE_OR_NOT_YET_IMPLEMENTED_LINK"}>
            {props.children}
        </Link>
    </Button>
);

const SocialMediaButton = (props: {
    href?: string;
    src: string | StaticImport;
    alt: string;
}) => (
    <li className="flex-0">
        <Link href={props.href ?? "#FAKE_OR_NOT_YET_IMPLEMENTED_LINK"}>
            <Image
                className="max-w-none"
                loading="eager"
                src={props.src}
                alt={props.alt}
                width={32}
                height={32}
            />
        </Link>
    </li>
);
