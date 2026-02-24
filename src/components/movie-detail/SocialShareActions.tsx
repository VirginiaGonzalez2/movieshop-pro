"use client";

import { useEffect } from "react";

type Props = {
    url: string;
    title: string;
};

export default function SocialShareActions({ url, title }: Props) {
    useEffect(() => {

        const scriptId = "addtoany-script";

        const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (existing) {
            // @ts-expect-error - AddToAny global
            window.a2a?.init_all?.();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://static.addtoany.com/menu/page.js";
        script.async = true;

        script.onload = () => {
            // @ts-expect-error - AddToAny global
            window.a2a?.init_all?.();
        };

        document.body.appendChild(script);
    }, []);

    return (
        <div className="border rounded p-6 space-y-3">
            <h2 className="text-xl font-semibold">Share</h2>

            <p className="text-sm text-muted-foreground">
                Share this movie page (includes MovieShop branding in the title).
            </p>

            <div
                className="a2a_kit a2a_kit_size_32 a2a_default_style"
                data-a2a-url={url}
                data-a2a-title={title}
            >
                <a className="a2a_button_facebook" />
                <a className="a2a_button_twitter" />
                <a className="a2a_button_instagram" />
                <a className="a2a_dd" href="https://www.addtoany.com/share" />
            </div>

            <p className="text-xs text-muted-foreground break-all">URL: {url}</p>
        </div>
    );
}
