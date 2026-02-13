/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 08:40:44
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 16:26:19
 *  Description: Default login form
 */

"use client";

import { FieldContinueWithLabel } from "@/components/ui-custom-shadcn/FieldContinueWithLabel";
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
import { loginFormSchema, LoginFormValues } from "@/form-schemas/login";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"form">;

export function LoginForm({ className, ...rest }: Props) {
    const router = useOriginRouter(true);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleSubmit(values: LoginFormValues) {
        console.log(values);

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });

        if (error) {
            toast.error(error.message || "An unknown error occurred. Please try again later.");
            return;
        }
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={twMerge(
                "p-4 border-2 max-w-100 rounded-xl gap-2 flex flex-col items-center",
                className,
            )}
            {...rest}
        >
            <FieldGroup>
                <FieldLegend>Log In</FieldLegend>
                <FieldDescription>Log in to track your orders and more.</FieldDescription>
                <FieldSet>
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    // autoComplete="email"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field>
                                <div className="w-full flex justify-between">
                                    <FieldLabel className="flex-0" htmlFor={field.name}>
                                        Password
                                    </FieldLabel>
                                    <FieldContent className="flex-0 text-sm text-link-primary text-nowrap">
                                        <Link href={router.formatUrl("/reset-password")}>
                                            Forgot your password?
                                        </Link>
                                    </FieldContent>
                                </div>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    // autoComplete="password"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                        <Link
                            replace
                            href={router.formatUrl("/register")}
                            className="text-link-primary"
                        >
                            here
                        </Link>{" "}
                        to register.
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}
