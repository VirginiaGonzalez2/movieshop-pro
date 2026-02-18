/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-09 14:00:40
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-18 16:40:18
 * @ Description: A router-like hook that stores information about where it started.
 */

"use client";

import { Url } from "next/dist/shared/lib/router/router";
import { redirect, RedirectType, usePathname, useSearchParams } from "next/navigation";

/* EXAMPLES

// export default function VIPMoviesPage() {
//     // Goal: We want to make the user login in before the they can access the vip movies.
//     const router = useOriginRouter();
//     const session = authClient.useSession();

//     if (session.isPending || session.isRefetching) {
//         return <Loading />;
//     }

//     if (!session.data) {
//         // The actual url we will redirect to here will look like: /login?from=vipmovies
//         router.push("/login");
//     }

//     return <VIPMovies />;
// }

// export default function LoginPage() {
//     // Goal: After a successfull login we want to return the user to /vipmovies
//     const router = useOriginRouter();

//     /* Form stuff here */

//     async function handleSubmit(values: LoginFormValues) {
//         /* better-auth sign-in here */

//         if (loginSuccess) {
//             router.returnToOrigin();
//         }
//     }

//     return (<form onSubmit={form.handleSubmit(handleSubmit)}>{/* All the form input stuff here */}</form>)
// }

class OriginRouter {
    public originUrl: string;

    public constructor(originUrl: string) {
        this.originUrl = originUrl.startsWith("/") ? originUrl.substring(1) : originUrl;
    }

    /**
     *
     * @returns the current url the user will redirect to when calling <router object>.returnToOrigin().
     */
    public getOrigin(): string {
        return "/" + this.originUrl;
    }

    /**
     * Takes an existing url and adds the origin url stored by this router as a search param to it.
     * @param url The current or desired router path. It can include search params.
     * @returns The new url.
     */
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

    /**
     * Equivalent to redirect(url, RedirectType.push) or router.push(url) (next/navigation), but also adds
     * the current origin url as a search param.
     * @param url The url to redirect to.
     */
    public push(url: Url): never {
        redirect(this.formatUrl(url), RedirectType.push);
    }

    /**
     * Equivalent to redirect(url, RedirectType.replace) or router.replace(url) (next router), but also adds
     * the current origin url as a search param.
     * @param url The url to redirect to.
     */
    public replace(url: Url): never {
        redirect(this.formatUrl(url), RedirectType.replace);
    }

    /**
     * Redirects the user back to the origin url.
     * @param replace (optional) If the url should replaced. If not specified or false, a normal (push) redirect will be used.
     */
    public returnToOrigin(replace?: boolean): never {
        redirect(`/${this.originUrl}`, replace ? RedirectType.replace : RedirectType.push);
    }
}

/**
 * Uses the url stored in 'from' search param or stores the current url, existing url is prioritized. Creates a next router-like
 * object which can be used to redirect to other pages while preserving this stored url.
 * @param useExistingOnly (optional) If true, the current url will not be stored if missing. If no origin url exists in the search params,
 * home will be redirected to if <router object>.returnToOrigin() is called.
 * @returns The router object used to redirect.
 */
export function useOriginRouter(useExistingOnly?: boolean): OriginRouter {
    let pathName = usePathname();
    const params = useSearchParams();

    if (params.size !== 0) {
        pathName += `?${params}`;
    }

    const originRouter = new OriginRouter(params.get("from") || (useExistingOnly ? "" : pathName));

    return originRouter;
}
