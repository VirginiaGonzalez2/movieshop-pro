import { redirect, RedirectType, useSearchParams } from "next/navigation";

function redirectWithSender(
    fromHref: string,
    toHref: string,
    type?: RedirectType
) {
    const params = new URLSearchParams(fromHref);

    params.set("from", toHref);

    redirect(`${fromHref}?${params}`, type);
}

type RedirectFunction = () => void;

function useRedirectToSender(type?: RedirectType): RedirectFunction | null {
    const params = useSearchParams();

    const from = params.get("from");

    if (!from) {
        return null;
    }

    let href = from;
    if (params.size > 1) {
        const newParams = new URLSearchParams(params);
        newParams.delete("from");
        href += `?${newParams}`;
    }

    return (): void => {
        redirect(href, type);
    };
}

export { redirectWithSender, useRedirectToSender };
