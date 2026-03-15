/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 08:40:44
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 16:26:19
 *  Description: Default login form
 */

"use client";

// import { FieldContinueWithLabel } from "@/components/ui-custom-shadcn/FieldContinueWithLabel";
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
import { redirect, RedirectType } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"form">;

export function LoginForm({ className, ...rest }: Props) {
    const router = useOriginRouter(true);

    const originlUrl = router.getOrigin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleSubmit(values: LoginFormValues) {
        try {
            console.log("[LOGIN] Payload:", values);
            const { error, session } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });
            if (error) {
                // Error oculto: no mostrar mensaje ni log
                return;
            }
            console.log("[LOGIN] Session:", session);
            redirect(originlUrl, RedirectType.replace);
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            toast.error("Login failed. Please try again.");
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
            <div className="mb-4 p-4 rounded-xl border bg-muted/30 text-center">
                <h2 className="text-lg font-semibold mb-2">Save your wishlist!</h2>
                <p className="text-sm text-muted-foreground">
                    To add movies to your wishlist, you need an account. Log in if you already have one, or create a new account to start saving your favorites.
                </p>
            </div>
            <FieldGroup>
                    <FieldLegend>Log In</FieldLegend>
                    <FieldDescription>Log in to track your orders, wishlist, and more.</FieldDescription>
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
                    {/* <FieldContinueWithLabel /> */}
                </Field>
                <Field>
                    {/* Bloque de registro mejorado ya incluido arriba */}
                </Field>
            </FieldGroup>
        </form>
    );
}
