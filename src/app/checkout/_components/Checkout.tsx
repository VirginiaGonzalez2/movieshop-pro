/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 14:17:47
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-09 09:00:39
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
import { FullPaymentMethodFormValues, OrderItemFormValues } from "@/form-schemas/checkout";
import { PaymentMethodFormValues, paymentMethodSchema } from "@/form-schemas/payment";
import {
    ShippingAddressFormValues,
    shippingAddressSchema,
    ShippingMethodFormValues,
    shippingMethodSchema,
} from "@/form-schemas/shipping";
import { ReactNode, useState } from "react";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { PlaceOrder } from "./PlaceOrder";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { ShippingMethodSelect } from "./ShippingMethodSelect";

type CheckoutStep = "shippingAddress" | "shippingMethod" | "paymentMethod" | "confirmation";

type Props = {
    orderItems: OrderItemFormValues[];
    orderCost: number;
    buyNow: boolean;
};

export function Checkout(props: Props) {
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
    const [paypalApproved, setPaypalApproved] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shippingAddress");

    // Allow manual control of accordion.
    function onClickHandler(step: CheckoutStep) {
        setCurrentStep(step);
    }

    function isShippingAddressFinalized() {
        return (
            shippingAddressSubmitted && shippingAddressSchema.safeParse(shippingAddressInfo).success
        );
    }

    function isShippingMethodFinalized() {
        return (
            shippingMethodSubmitted && shippingMethodSchema.safeParse(shippingMethodInfo).success
        );
    }

    function isPaymentMethodFinalized() {
        return paymentMethodSubmitted && paymentMethodSchema.safeParse(paymentMethodInfo).success;
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

    return (
        <Accordion type="single" value={currentStep}>
            <CheckoutStepComponent
                title="Address"
                step={"shippingAddress"}
                enabled={true}
                onClickHandler={onClickHandler}
            >
                <ShippingAddressForm
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
                    nextStep="Confirmation"
                    savedValues={paymentMethodInfo}
                    orderCost={props.orderCost}
                    onPayPalApprovedChange={setPaypalApproved}
                    onSubmit={handlePaymentMethodSubmit}
                />
            </CheckoutStepComponent>
            <CheckoutStepComponent
                title="Confirmation"
                step={"confirmation"}
                enabled={enableConfirmation}
                onClickHandler={onClickHandler}
            >
                {shippingAddressInfo && shippingMethodInfo && paymentMethodInfo && (
                    <PlaceOrder
                        orderItems={props.orderItems}
                        shippingAddress={shippingAddressInfo}
                        shippingMethod={shippingMethodInfo}
                        paymentMethod={paymentMethodInfo}
                        paypalApproved={paypalApproved}
                        autoSubmit={paymentMethodInfo.paymentMethod === "paypal" && paypalApproved}
                        buyNow={props.buyNow}
                    />
                )}
            </CheckoutStepComponent>
        </Accordion>
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
