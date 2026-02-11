/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 14:00:40
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-10 13:42:37
 *  Description: Various navigation utility.
 */

import {
    ReadonlyURLSearchParams,
    redirect,
    RedirectType,
    usePathname,
    useSearchParams,
} from "next/navigation";

type PropsWithOrigin = {
    origin: string | null;
};

/**
 *
 * @param fromHref
 * @param toHref
 * @param type
 */
function redirectWithOrigin(
    fromHref: string,
    toHref: string,
    type?: RedirectType
) {
    const params = new URLSearchParams(fromHref);

    params.set("from", toHref);

    redirect(`${fromHref}?${params}`, type);
}

/**
 *
 * @param params
 * @param type
 */
function redirectToOrigin(
    params: ReadonlyURLSearchParams,
    type?: RedirectType
) {
    let href = params.get("from") ?? "/";

    if (params.size > 1) {
        const newParams = new URLSearchParams(params);
        newParams.delete("from");
        href += `?${newParams}`;
    }

    redirect(href, type);
}
type RedirectFunction = () => void;

function useOriginRoute() {
    const params = useSearchParams();
    return params.get("from");
}

/**
 * Hook
 * @param fallbackHref
 * @param type
 * @returns
 */
function useOriginRedirect(
    /// test
    fallbackHref?: string,
    type?: RedirectType
): RedirectFunction {
    const params = useSearchParams();
    // const path = usePathname();

    const from = params.get("from");

    let href = from ?? fallbackHref;
    if (fallbackHref && params.size > 1) {
        const newParams = new URLSearchParams(params);
        newParams.delete("from");
        href += `?${newParams}`;
    }

    return (): void => {
        redirect(href ?? "/", type);
    };
}

export {
    type PropsWithOrigin,
    redirectWithOrigin,
    redirectToOrigin,
    useOriginRoute,
    useOriginRedirect,
};
