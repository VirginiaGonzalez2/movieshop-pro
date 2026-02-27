/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 16:58:17
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-02-25 16:19:17
 *   Description: Shipping method selection.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ShippingMethodFormValues, shippingMethodSchema } from "@/form-schemas/shipping";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type Props = {
    nextStep: string;
    savedValues: ShippingMethodFormValues | null;
    onSubmit: (values: ShippingMethodFormValues) => void;
};

export function ShippingMethodSelect(props: Props) {
    const form = useForm<ShippingMethodFormValues>({
        resolver: zodResolver(shippingMethodSchema),
        defaultValues: {
            shippingMethod: props.savedValues?.shippingMethod,
        },
    });

    return (
        <form onSubmit={form.handleSubmit(props.onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="shippingMethod"
                    render={({ field, fieldState }) => (
                        <Field>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={props.savedValues?.shippingMethod}
                            >
                                <SelectTrigger id={"shippingMethod"} className="w-full max-w-48">
                                    <SelectValue placeholder="Shipping Options" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select a Shipping Method</SelectLabel>
                                        <SelectItem value={"bring"}>Bring</SelectItem>
                                        <SelectItem value={"budbee"}>Budbee</SelectItem>
                                        <SelectItem value={"dhl"}>DHL</SelectItem>
                                        <SelectItem value={"earlyBird"}>Early Bird</SelectItem>
                                        <SelectItem value={"instabox"}>Instabox</SelectItem>
                                        <SelectItem value={"postnordHome"}>
                                            PostNord Home Delivery
                                        </SelectItem>
                                        <SelectItem value={"postnordPackage"}>
                                            PostNord Package
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Button className="w-fit self-center" type="submit">
                    Continue to {props.nextStep}
                </Button>
            </FieldGroup>
        </form>
    );
}
