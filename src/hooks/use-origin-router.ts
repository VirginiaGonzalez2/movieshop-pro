/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 14:00:40
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-12 01:08:00
 *  Description: Various navigation utility.
 */

import { Url } from "next/dist/shared/lib/router/router";
import { redirect, RedirectType, usePathname, useSearchParams } from "next/navigation";

class OriginRouter {
    public originUrl: string;

    public constructor(originUrl: string) {
        this.originUrl = originUrl.startsWith("/") ? originUrl.substring(1) : originUrl;
    }

    public getOrigin(): string {
        return "/" + this.originUrl;
    }

    public formatUrl(url: Url): string {
        if (this.originUrl.length == 0) {
            return url.toString();
        }

        url = url.toString();

        const pathName = url.match(/(.*)\?.*/i)?.toString() || url;
        const params = url.match(/.*\?(.*)/i)?.toString();

        const newParams = new URLSearchParams(params);
        newParams.set("from", this.originUrl);

        return `${pathName}?${newParams}`;
    }

    public push(url: Url): never {
        redirect(this.formatUrl(url), RedirectType.push);
    }

    public replace(url: Url): never {
        redirect(this.formatUrl(url), RedirectType.replace);
    }

    public returnToOrigin(replace?: boolean): never {
        redirect(`/${this.originUrl}`, replace ? RedirectType.replace : RedirectType.push);
    }
}

export function useOriginRouter(useExistingOnly?: boolean): OriginRouter {
    const pathName = usePathname();
    const params = useSearchParams();

    const originRouter = new OriginRouter(params.get("from") || (useExistingOnly ? "" : pathName));

    return originRouter;
}
