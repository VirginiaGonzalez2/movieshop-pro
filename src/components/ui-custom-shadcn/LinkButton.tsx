/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-13 15:18:32
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-13 15:43:18
 *   Description: This Button+Link can be disabled which does not work when using 'asChild'.
 */

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type Props = Omit<React.ComponentProps<typeof Button>, "asChild"> & {
    href: Url;
    replace?: boolean;
};

export function LinkButton({ children, disabled, href, replace, ...rest }: Props) {
    return (
        <Button asChild={!disabled} disabled={disabled} {...rest}>
            {disabled ? (
                <>{children}</>
            ) : (
                <Link href={href} replace={replace}>
                    {children}
                </Link>
            )}
        </Button>
    );
}
