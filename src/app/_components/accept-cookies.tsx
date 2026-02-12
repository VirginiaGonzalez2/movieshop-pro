"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const cookieName = "accepted-cookies";

export default function AcceptCookies() {
    const [accepted, setAccepted] = useState(false);
    const [noButtonFlag, setNoButtonFlag] = useState(false);

    function cookiesAccepted() {
        if (typeof window === "undefined") {
            return false;
        }

        const cookiesAccepted = localStorage.getItem(cookieName) != null;
        return cookiesAccepted;
    }

    if (accepted && cookiesAccepted()) {
        return <></>;
    }

    function acceptCookies() {
        localStorage.setItem(cookieName, "1");
    }

    return (
        <div className="pt-15 pb-20 absolute bottom-0 w-full h-[80%] gap-2 bg-blue-100 flex flex-col items-center justify-around">
            <Label className="text-xl">Accept the cookies or else...</Label>
            <Image alt="A delicious cookie" src="/cookie.png" width={200} height={200} />
            <Label className="text-xl">Do you accept?</Label>
            <div className="gap-4 flex flex-col justify-around">
                <div className="w-fit gap-2 flex">
                    <div className="w-10 gap-2 flex-1 flex flex-row-reverse">
                        <Button className="float-right" onClick={acceptCookies}>
                            Yes
                        </Button>
                        {noButtonFlag && (
                            <Button
                                className="float-right"
                                onMouseEnter={() => setNoButtonFlag(false)}
                            >
                                No
                            </Button>
                        )}
                    </div>
                    <div className="w-10 flex-1 flex">
                        {!noButtonFlag && (
                            <Button
                                className="float-left"
                                onMouseEnter={() => setNoButtonFlag(true)}
                            >
                                No
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
