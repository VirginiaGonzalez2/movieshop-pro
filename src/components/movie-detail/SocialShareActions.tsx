"use client";

import ShareIconButton from "@/components/movie-detail/ShareIconButton";

type Props = {
    url: string;
    title: string;
};

export default function SocialShareActions({ url, title }: Props) {
    return (
        <div className="flex items-center gap-2">
            <ShareIconButton url={url} title={title} />
        </div>
    );
}
