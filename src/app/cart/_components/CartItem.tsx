/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-18 13:18:06
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-05 10:29:23
 *   Description: Cart item.
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
import { CartItemControls } from "@/components/cart/CartItemControls";
import { PriceTag } from "@/components/ui/PriceTag";

type Props = {
    item: ShoppingCartItemInfo;
};

export default async function CartItem({ item }: Props) {
    return (
        <Item asChild className="p-4 border-2 w-full rounded-xl">
            <li className="flex items-center">
                <ItemMedia className="flex-0 w-30 h-40 rounded-sm bg-black text-white">
                    <Image
                        className="max-w-30 max-h-40 rounded-sm"
                        src={item.imageUrl || `/movies/${item.itemId}`}
                        width={120}
                        height={160}
                        alt={`Cover for ${item.title}`}
                    />
                </ItemMedia>
                <ItemGroup className="min-w-fit flex-0 flex flex-col">
                    <ItemHeader>{item.title}</ItemHeader>
                    <GenreList genres={item.genres} />
                </ItemGroup>
                <div className="flex-1 flex justify-end">
                    <CartItemControls
                        itemId={item.itemId}
                        title={item.title}
                        quantity={item.quantity}
                        stock={item.stock}
                    />
                </div>
                <ItemContent className="min-w-14 flex-0 text-center">
                    <PriceTag amount={Number(item.price * item.quantity)} />
                </ItemContent>
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
