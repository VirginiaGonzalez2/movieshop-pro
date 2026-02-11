/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 09:29:11
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-10 08:39:02
 *  Description: A wrapper component for Link that saves information about where the user left or should return to.
 */

import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
    href: string;
    searchParams: ReadonlyURLSearchParams;
};

export function LinkWithOrigin({
    href,
    searchParams,
    children,
    ...rest
}: Props) {
    return (
        <Link
            href={{
                pathname: href,
                query: searchParams.toString(),
            }}
            {...rest}
        >
            {children}
        </Link>
    );
}
