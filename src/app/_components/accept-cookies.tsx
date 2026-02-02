"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { use, useState } from "react";
import Image from "next/image";
import { acceptCookies, cookiesAccepted } from "@/actions/accept-cookies";

type Props = {
    cookiesAccepted: Promise<boolean>;
};

export default function AcceptCookies(props: Props) {
    //const [cookiesAcceptedFlag, setCookiesAcceptedFlag] = useState(true);
    const [noButtonFlag, setNoButtonFlag] = useState(false);

    // if (cookiesAcceptedAction) {
    //     return <></>;
    // }

    return (
        <div className="pt-15 pb-20 absolute bottom-0 w-full h-[80%] gap-2 bg-blue-100 flex flex-col items-center justify-around">
            <Label className="text-xl">Accept the cookies or else...</Label>
            <Image
                alt="A delicious cookie"
                src="/cookie.png"
                width={200}
                height={200}
            />
            <Label className="text-xl">Do you accept?</Label>
            <div className="gap-4 flex flex-col justify-around">
                <div className="w-fit gap-2 flex">
                    <div className="w-10 gap-2 flex-1 flex flex-row-reverse">
                        <Button
                            className="float-right"
                            onSubmit={acceptCookies}>
                            Yes
                        </Button>
                        {noButtonFlag && (
                            <Button
                                className="float-right"
                                onMouseEnter={() => setNoButtonFlag(false)}>
                                No
                            </Button>
                        )}
                    </div>
                    <div className="w-10 flex-1 flex">
                        {!noButtonFlag && (
                            <Button
                                className="float-left"
                                onMouseEnter={() => setNoButtonFlag(true)}>
                                No
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
