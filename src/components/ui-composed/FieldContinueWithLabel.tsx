/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-10 10:26:34
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-10 15:08:15
 *  Description: -------- Or continue with --------
 */

import React from "react";
import { FieldContent, FieldSeparator } from "../ui/field";
import { twMerge } from "tailwind-merge";
import { Label } from "../ui/label";

type Props = Omit<React.ComponentProps<typeof FieldContent>, "children">;

export function FieldContinueWithLabel({ className, ...rest }: Props) {
    return (
        <FieldContent
            className={twMerge("flex-1 flex flex-row items-center", className)}
            {...rest}
        >
            <FieldSeparator className="flex-1" />
            <Label className="mt-0 text-sm text-muted-foreground flex-0 text-nowrap">
                Or continue with
            </Label>
            <FieldSeparator className="flex-1" />
        </FieldContent>
    );
}
