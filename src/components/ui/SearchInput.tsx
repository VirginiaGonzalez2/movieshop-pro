"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    onValueChange?: (value: string) => void;
};

export function SearchInput({
    className,
    onValueChange,
    placeholder = "Search…",
    ...props
}: Props) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                {...props}
                placeholder={placeholder}
                className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                onChange={(e) => onValueChange?.(e.target.value)}
            />
        </div>
    );
}
