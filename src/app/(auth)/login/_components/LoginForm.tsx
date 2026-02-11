/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 08:40:44
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-11 11:42:59
 *  Description: Default login form
 */

"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { LinkWithOrigin } from "@/components/navigation/LinkWithOrigin";
import { FieldContinueWithLabel } from "@/components/ui-composed/FieldContinueWithLabel";
import { useOriginRedirect } from "@/utils/navigation";

const formSchema = z.object({
    email: z.email(),
    password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = React.ComponentProps<"form">;

export function LoginForm({ className, ...rest }: Props) {
    //const isMobile = useIsMobile();

    const params = useSearchParams();
    const redirectToOrigin = useOriginRedirect();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleSubmit(values: FormValues) {
        console.log(values);

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });

        if (error) {
            toast.error(
                error.message ||
                    "An unknown error occurred. Please try again later."
            );
            return;
        }

        redirectToOrigin();
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={twMerge(
                "p-4 border-2 max-w-100 rounded-xl gap-2 flex flex-col items-center",
                className
            )}
            {...rest}
        >
            <FieldGroup>
                <FieldLegend>Log In</FieldLegend>
                <FieldDescription>
                    Log in to track your orders and more.
                </FieldDescription>
                <FieldSet>
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor={field.name}>
                                    E-mail
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    // autoComplete="email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field>
                                <div className="flex justify-between">
                                    <FieldLabel htmlFor={field.name}>
                                        Password
                                    </FieldLabel>
                                    <FieldContent className="text-sm text-link-primary place-self-end">
                                        <LinkWithOrigin
                                            href="/reset-password"
                                            className=""
                                            searchParams={params}
                                        >
                                            Forgot your password?
                                        </LinkWithOrigin>
                                    </FieldContent>
                                </div>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    // autoComplete="password"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldSet>
                <Field className="justify-between">
                    <Button type="submit">Log In</Button>
                    <FieldContinueWithLabel />
                </Field>
                <Field>
                    <FieldDescription>
                        Don&apos;t have an account? Click{" "}
                        <LinkWithOrigin
                            replace
                            href="/register"
                            className="text-link-primary"
                            searchParams={params}
                        >
                            here
                        </LinkWithOrigin>{" "}
                        to register.
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}
