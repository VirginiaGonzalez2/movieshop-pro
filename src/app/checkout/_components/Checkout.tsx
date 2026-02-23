/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 14:17:47
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-23 16:33:19
 *   Description: Main checkout form.
 */

"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FieldGroup } from "@/components/ui/field";
import {
    FullPaymentMethodFormValues,
    PaymentMethodFormValues,
    ShippingAddressFormValues,
    shippingAddressSchema,
    ShippingMethodFormValues,
} from "@/form-schemas/checkout";
import { ReactNode, useState } from "react";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { ShippingMethodSelect } from "./ShippingMethodSelect";

type CheckoutStep = "shippingAddress" | "shippingMethod" | "paymentMethod" | "confirmation";

export function Checkout() {
    const [shippingAddressInfo, setShippingAddressInfo] =
        useState<ShippingAddressFormValues | null>(null);
    const [shippingMethodInfo, setShippingMethodInfo] = useState<ShippingMethodFormValues | null>(
        null,
    );
    const [paymentMethodInfo, setPaymentMethodInfo] = useState<FullPaymentMethodFormValues | null>(
        null,
    );
    const [shippingAddressSubmitted, setShippingAddressSubmitted] = useState(false);
    const [shippingMethodSubmitted, setShippingMethodSubmitted] = useState(false);
    const [paymentMethodSubmitted, setPaymentMethodSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shippingAddress");

    function onClickHandler(step: CheckoutStep) {
        setCurrentStep(step);
    }

    function isShippingAddressFinalized() {
        return (
            shippingAddressSubmitted && shippingAddressSchema.safeParse(shippingAddressInfo).success
        );
    }

    function isShippingMethodFinalized() {
        return shippingMethodSubmitted;
    }

    function isPaymentMethodFinalized() {
        return paymentMethodSubmitted;
    }

    const enableShipping = isShippingAddressFinalized();
    const enablePayment = enableShipping && isShippingMethodFinalized();
    const enableConfirmation = enableShipping && enablePayment && isPaymentMethodFinalized();

    function handleShippingAddressSubmit(values: ShippingAddressFormValues) {
        setShippingAddressInfo(values);
        setShippingAddressSubmitted(true);
        setCurrentStep("shippingMethod");
    }

    function handleShippingMethodSubmit(values: ShippingMethodFormValues) {
        setShippingMethodInfo(values);
        setShippingMethodSubmitted(true);
        setCurrentStep("paymentMethod");
    }

    function handlePaymentMethodSubmit(values: PaymentMethodFormValues) {
        setPaymentMethodInfo(values as FullPaymentMethodFormValues);
        setPaymentMethodSubmitted(true);
        setCurrentStep("confirmation");
    }

    async function handleConfirmSubmit() {}

    const Form = currentStep === "confirmation" ? "form" : "div";

    return (
        <Form onSubmit={currentStep === "confirmation" ? handleConfirmSubmit : undefined}>
            <Accordion type="single" value={currentStep}>
                <CheckoutStepComponent
                    title="Address"
                    step={"shippingAddress"}
                    enabled={true}
                    onClickHandler={onClickHandler}
                >
                    <ShippingAddressForm
                        active={currentStep === "shippingAddress"}
                        nextStep="Shipping"
                        savedValues={shippingAddressInfo}
                        onSubmit={handleShippingAddressSubmit}
                    />
                </CheckoutStepComponent>
                <CheckoutStepComponent
                    title="Shipping"
                    step={"shippingMethod"}
                    enabled={enableShipping}
                    onClickHandler={onClickHandler}
                >
                    <ShippingMethodSelect
                        active={currentStep === "shippingMethod"}
                        nextStep="Payment"
                        savedValues={shippingMethodInfo}
                        onSubmit={handleShippingMethodSubmit}
                    />
                </CheckoutStepComponent>
                <CheckoutStepComponent
                    title="Payment"
                    step={"paymentMethod"}
                    enabled={enablePayment}
                    onClickHandler={onClickHandler}
                >
                    <PaymentMethodSelect
                        active={currentStep === "paymentMethod"}
                        nextStep="Confirmation"
                        savedValues={paymentMethodInfo}
                        onSubmit={handlePaymentMethodSubmit}
                    />
                </CheckoutStepComponent>
                <CheckoutStepComponent
                    title="Confirmation"
                    step={"confirmation"}
                    enabled={enableConfirmation}
                    onClickHandler={onClickHandler}
                >
                    FINAL PREVIEW HERE AND FINALIZE ORDER BUTTON
                </CheckoutStepComponent>
            </Accordion>
        </Form>
    );
}

type CheckoutStepProps = {
    title: string;
    step: CheckoutStep;
    enabled: boolean;
    onClickHandler: (step: CheckoutStep) => void;
    children: ReactNode;
};

const CheckoutStepComponent = ({
    title,
    step,
    enabled,
    onClickHandler,
    children,
}: CheckoutStepProps) => (
    <AccordionItem value={step} disabled={!enabled}>
        <AccordionTrigger
            onClick={() => {
                if (enabled) onClickHandler(step);
            }}
        >
            {title}
        </AccordionTrigger>
        <AccordionContent>
            <FieldGroup className="justify-center">{children}</FieldGroup>
        </AccordionContent>
    </AccordionItem>
);
