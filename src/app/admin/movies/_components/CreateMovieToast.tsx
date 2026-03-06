"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function CreateMovieToast() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const created = searchParams.get("created");
        if (created !== "1") return;

        toast.success("Movie added");

        router.replace("/admin/movies");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
