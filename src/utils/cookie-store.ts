function getSessionCookieStore(): Storage | undefined {
    return typeof sessionStorage !== "undefined" ? sessionStorage : undefined;
}

function getLocalCookieStore(): Storage | undefined {
    return typeof localStorage !== "undefined" ? localStorage : undefined;
}

export { getSessionCookieStore, getLocalCookieStore };
