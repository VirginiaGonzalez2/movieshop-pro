"use client";

import { useTransition } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
    url: string;
    title: string;
};

export default function ShareIconButton({ url, title }: Props) {
    const [isPending, startTransition] = useTransition();

    async function doShare() {
        const nav: Navigator | undefined =
            typeof window !== "undefined" ? window.navigator : undefined;

        try {
            // Native share (mobile mostly)
            if (nav && typeof nav.share === "function") {
                await nav.share({ title, url });
                toast.success("Shared");
                return;
            }

            // Clipboard fallback
            if (nav?.clipboard?.writeText) {
                await nav.clipboard.writeText(url);
                toast.success("Link copied");
                return;
            }

            toast.error("Sharing not supported in this browser");
        } catch {
            toast.error("Share failed");
        }
    }

    function onClick() {
        startTransition(doShare);
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={isPending}
            aria-label="Share"
            title="Share"
            className="h-11 w-11 rounded-full bg-white shadow-sm transition-transform duration-200 hover:shadow-md hover:scale-105 active:scale-95"
        >
            <Share2 className="h-5 w-5" />
        </Button>
    );
}
