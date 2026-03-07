/**
 *   Author: Sabrina Bjurman
 *   Create Time: 2026-02-19 17:05:36
 *   Modified by: Sabrina Bjurman
 *   Modified time: 2026-03-06 12:10:45
 *   Description: Shipping address form.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ShippingAddressFormValues,
    shippingAddressSchema,
    shippingCountries,
} from "@/form-schemas/shipping";
import { buildInputFilter } from "@/utils/input-event-filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

type Props = {
    nextStep: string;
    savedValues: ShippingAddressFormValues | null;
    onSubmit: (values: ShippingAddressFormValues) => void;
};

// TODO: This will need to be adjusted or removed, but for now only allow swedish post code format.
const postalCodeInputFilter = buildInputFilter({ numericsOnly: true, maxLength: 5 });

export function ShippingAddressForm(props: Props) {
    const isMobile = useIsMobile();

    const form = useForm<ShippingAddressFormValues>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: {
            firstName: props.savedValues?.firstName ?? "",
            lastName: props.savedValues?.lastName ?? "",
            streetAddress: props.savedValues?.streetAddress ?? "",
            postalCode: props.savedValues?.postalCode ?? "",
            city: props.savedValues?.city ?? "",
            country: props.savedValues?.country ?? "",
        },
    });

    return (
        <form id="shippingAddress" onSubmit={form.handleSubmit(props.onSubmit)}>
            <FieldGroup className="text-nowrap">
                <FieldSet className={isMobile ? "flex-col" : "flex-row"}>
                    <Controller
                        control={form.control}
                        name="firstName"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="given-name" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="lastName"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="family-name" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldSet>

                <Controller
                    control={form.control}
                    name="streetAddress"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Street</FieldLabel>
                            <Input {...field} id={field.name} autoComplete="street-address" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <FieldSet className="flex-row">
                    <Controller
                        control={form.control}
                        name="postalCode"
                        render={({ field, fieldState }) => (
                            <Field className="flex-2">
                                <FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="postal-code"
                                    onBeforeInput={postalCodeInputFilter}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="city"
                        render={({ field, fieldState }) => (
                            <Field className="flex-3">
                                <FieldLabel htmlFor={field.name}>City</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="address-level1" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldSet>
                <Controller
                    control={form.control}
                    name="country"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                            <CountrySelection onValueChange={field.onChange} {...field} />
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

type CountrySelectionProps = React.ComponentProps<typeof Select> & {
    onValueChange: (value: string) => void;
};

function CountrySelection({ onValueChange, ...selectProps }: CountrySelectionProps) {
    return (
        <Select onValueChange={onValueChange} {...selectProps}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a country</SelectLabel>
                    {shippingCountries.map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
