"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number; // 0..5
  outOf?: number; // default 5
  size?: number; // px
  className?: string;

  onChange?: (value: number) => void;
};

export function RatingStars({
  value,
  outOf = 5,
  size = 16,
  className,
  onChange,
}: Props) {
  const clamped = Math.max(0, Math.min(value, outOf));
  const interactive = typeof onChange === "function";

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: outOf }).map((_, i) => {
        const starIndex = i + 1;
        const filled = clamped >= starIndex;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(starIndex)}
            className={cn(
              "p-0.5",
              interactive ? "cursor-pointer" : "cursor-default",
            )}
            aria-label={`Rate ${starIndex} out of ${outOf}`}
          >
            <Star
              width={size}
              height={size}
              className={cn(
                filled ? "fill-current" : "fill-transparent",
                "text-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
