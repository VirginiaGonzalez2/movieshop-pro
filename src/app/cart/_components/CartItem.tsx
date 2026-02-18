/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-18 13:18:06
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-18 14:15:37
 *   Description:
 */

"use server";

import { ShoppingCartItemInfo } from "@/actions/shopping-cart";
import {
    Item,
    ItemContent,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
} from "@/components/ui/item";
import Image from "next/image";
import { CartItemControls } from "./CartItemControls";

type Props = {
    item: ShoppingCartItemInfo;
};

export default async function CartItem({ item }: Props) {
    const formatter = Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" });

    return (
        <Item asChild className="p-4 border-2 w-full rounded-xl">
            <li className="flex items-center">
                <ItemMedia className="flex-0 min-w-25 h-30 rounded-sm bg-black text-white">
                    <Image
                        src={item.imageUrl || `/movies/${item.itemId}`}
                        width={80}
                        height={120}
                        alt={`Cover for ${item.title}`}
                    />
                </ItemMedia>
                <ItemGroup className="min-w-fit flex-0 flex flex-col">
                    <ItemHeader>{item.title}</ItemHeader>
                    <GenreList genres={item.genres} />
                </ItemGroup>
                <div className="flex-1 flex justify-end">
                    <CartItemControls itemId={item.itemId} quantity={item.quantity} />
                </div>
                <ItemContent className="flex-0">{formatter.format(Number(item.price))}</ItemContent>
            </li>
        </Item>
    );
}

type GenreListProps = { genres: string[] };

function GenreList({ genres }: GenreListProps) {
    return genres.length >= 0 ? (
        <ItemGroup>
            <ul className="gap-1 flex flex-nowrap">
                {genres.map((genreName, index) => (
                    <div key={index} className="contents">
                        {index !== 0 && (
                            <ItemSeparator className="bg-black" orientation="vertical" />
                        )}
                        <li className="text-secondary-foreground">
                            <ItemContent>{genreName}</ItemContent>
                        </li>
                    </div>
                ))}
            </ul>
        </ItemGroup>
    ) : (
        <></>
    );
}
