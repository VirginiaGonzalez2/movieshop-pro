import { cookies } from "next/headers";

export async function cookiesAccepted(): Promise<boolean> {
    const cookieStore = await cookies();

    const cookiesAccepted = cookieStore.get("cookies-accepted");

    return cookiesAccepted != undefined;
}

export async function acceptCookies(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set("cookies-accepted", "1");
}
