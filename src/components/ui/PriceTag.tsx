import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  amount: number | string;
  currency?: string;
  locale?: string;
  className?: string;
};

export function PriceTag({
  amount,
  currency = "SEK",
  locale = "sv-SE",
  className,
}: Props) {
  const num = typeof amount === "number" ? amount : Number(amount);

  const formatted = Number.isFinite(num)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(num)
    : String(amount);

  return <span className={cn("font-semibold", className)}>{formatted}</span>;
}
