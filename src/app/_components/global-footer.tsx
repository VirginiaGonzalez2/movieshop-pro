"use client";

import MovieShopLogo from "@/components/ui-brand/movieshop-logo";
import { Button } from "@/components/ui/button";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { ChildrenOnlyProps } from "@/utils/common-props";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function GlobalFooter({
    className,
    ...footerProps
}: React.ComponentProps<"footer">) {
    const [expanded, setExpanded] = useState(false);

    return (
        <footer
            className={twMerge(className, "bg-foreground text-nowrap")}
            onMouseLeave={() => setExpanded(false)}
            {...footerProps}>
            <div className="flex flex-col">
                <div className="flex-1 flex justify-between items-center">
                    <MovieShopLogo variant="footer" className="flex-1" />
                    <List
                        className="gap-2 flex-0 items-center justify-start"
                        onMouseEnter={() => setExpanded(true)}>
                        <ListItemLinkButton href={undefined}>
                            Quick Links
                        </ListItemLinkButton>
                        <ListItemLinkButton href={undefined}>
                            Support
                        </ListItemLinkButton>
                        <ListItemLinkButton href={undefined}>
                            Blog
                        </ListItemLinkButton>
                        <ListItemLinkButton href={undefined}>
                            Forum
                        </ListItemLinkButton>
                        <ListItemLinkButton href={undefined}>
                            FAQs
                        </ListItemLinkButton>
                    </List>
                    <List className="gap-2 flex-0 items-center justify-start">
                        <ListItemSocialMediaIcon
                            href={undefined}
                            src="/social-media/facebook.png"
                            alt="Facebook"
                        />
                        <ListItemSocialMediaIcon
                            href={undefined}
                            src="/social-media/tiktok.png"
                            alt="TikTok"
                        />
                        <ListItemSocialMediaIcon
                            href={undefined}
                            src="/social-media/twitter.png"
                            alt="X (formerly known as Twitter)"
                        />
                        <ListItemSocialMediaIcon
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            src="/social-media/youtube.png"
                            alt="YouTube"
                        />
                    </List>
                </div>

                {/* <Collapsible className="text-white">
                    <CollapsibleTrigger>
                        Can I use this in my project?
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        Yes. Free to use for personal and commercial projects.
                        No attribution required.
                    </CollapsibleContent>
                </Collapsible> */}

                {/* Expanded links */}
                {expanded && (
                    <>
                        <div className="size-fit flex-1 flex">
                            <ExpandedList>
                                <ListItemHeader>Quick Links</ListItemHeader>
                                <ListItemLink href={undefined}>
                                    Home
                                </ListItemLink>
                                <ListItemLink href={undefined}>
                                    Movies
                                </ListItemLink>
                            </ExpandedList>
                            <ExpandedList>
                                <ListItemHeader>Support</ListItemHeader>
                                <ListItemLink href={undefined}>
                                    About
                                </ListItemLink>
                                <ListItemLink href={undefined}>
                                    Privacy
                                </ListItemLink>
                            </ExpandedList>
                            <ExpandedList>
                                <ListItemHeader>Community</ListItemHeader>
                                <ListItemLink href={undefined}>
                                    Blog
                                </ListItemLink>
                                <ListItemLink href={undefined}>
                                    Forum
                                </ListItemLink>
                                <ListItemLink href={undefined}>
                                    FAQs
                                </ListItemLink>
                            </ExpandedList>
                        </div>

                        {/* Copyright */}
                        <Item className="flex-1 text-muted self-center">
                            <ItemDescription className="">
                                &copy;2026 MovieShop
                            </ItemDescription>
                        </Item>
                    </>
                )}
            </div>
        </footer>
    );
}

// TODO: Possibly move outside if useful elsewhere.

const List = ({
    vertical,
    className,
    children,
    ...rest
}: React.ComponentProps<"ul"> & { vertical?: boolean; centered?: boolean }) => (
    <ul
        className={twMerge(
            "size-fit flex-1 flex flex-nowrap items-center",
            vertical ? "flex-col" : "flex-row",
            // centered ? "justify-start" : "",
            className,
        )}
        {...rest}>
        {children}
    </ul>
);

const ListItem = ({ children }: ChildrenOnlyProps) => (
    <li className="flex-1">{children}</li>
);

const ListItemLinkButton = (props: { href?: string; children: ReactNode }) => (
    <ItemTitle>
        <Button
            asChild
            variant="link"
            className="text-background"
            type="button">
            <Link href={props.href ?? "#FAKE_OR_NOT_YET_IMPLEMENTED_LINK"}>
                {props.children}
            </Link>
        </Button>
    </ItemTitle>
);

const ListItemSocialMediaIcon = (props: {
    href?: string;
    src: string | StaticImport;
    alt: string;
}) => (
    <ListItem>
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
    </ListItem>
);

const ExpandedList = ({ children }: ChildrenOnlyProps) => (
    <Item className="gap-2 flex-0 flex flex-col">{children}</Item>
);

const ListItemHeader = (props: { href?: string; children: ReactNode }) => (
    <ItemTitle className="text-background">
        <Label>{props.children}</Label>
    </ItemTitle>
);

/*
"text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
*/
const ListItemLink = (props: { href?: string; children: ReactNode }) => (
    <ItemContent className="flex-0">
        <Button
            asChild
            variant="link"
            className="text-muted [&>a:hover]:text-primary-foreground">
            <Link href={props.href ?? "#FAKE_OR_NOT_YET_IMPLEMENTED_LINK"}>
                {props.children}
            </Link>
        </Button>
    </ItemContent>
);
