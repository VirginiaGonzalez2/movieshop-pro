/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-09 08:39:46
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 13:34:29
 *  Description: Primary account registration form.
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import z from "zod";
import { FieldContinueWithLabel } from "../../../../components/ui-composed/FieldContinueWithLabel";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../components/ui/collapsible";

const errUsernameLength = "Username must be between 2-20 characters long.";
const errPasswordLength = "Password must be between 8-20 characters long.";

const formSchema = z
    .object({
        name: z.string().min(2, errUsernameLength).max(20, errPasswordLength),
        email: z.email(),
        password: z.string().min(8, errPasswordLength).max(128, errPasswordLength),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof formSchema>;

type Props = React.ComponentProps<"form">;

export function RegistrationForm({ className, ...rest }: Props) {
    const router = useOriginRouter(true);

    const terms = useRef<HTMLButtonElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function handleSubmit(values: FormValues) {
        const { error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        });

        toast.message("HELLO!");

        if (error) {
            toast.error(error.message || "An unknown error occurred. Please try again later.");
            return;
        }

        toast.warning("Before you can sign in you must verify your email.", {
            duration: 10000,
        });

        router.returnToOrigin();
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={twMerge(
                "p-4 border-2 max-w-100 rounded-xl flex flex-col justify-center items-center gap-2",
                className,
            )}
            {...rest}
        >
            <FieldGroup className="justify-center">
                <FieldLegend>Registration</FieldLegend>
                <FieldDescription>
                    Buy or rent the best and worst movies of all time. Registering your account with
                    us is free.
                </FieldDescription>
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input {...field} id={field.name} autoComplete="name" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                            <Input {...field} id={field.name} type="email" autoComplete="email" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type="password"
                                autoComplete="new-password"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                            <Input {...field} id={field.name} type="password" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Field>
                    <Button type="submit">Register</Button>
                    <FieldContinueWithLabel />
                    <Button type="button" className="bg-green-600">
                        Google
                    </Button>
                    <Button type="button" className="bg-blue-600">
                        Facebook
                    </Button>
                </Field>
                <FieldContent>
                    <p className="text-sm text-nowrap">
                        Already have an account?{" "}
                        <Link href={router.formatUrl("/login")} className="text-link-primary">
                            Click here to log in
                        </Link>
                    </p>
                </FieldContent>
                <Collapsible>
                    <FieldDescription className="text-xs">
                        For less information about how we definitely don&apos;t use your data, do
                        not read our non-existing{" "}
                        <CollapsibleTrigger ref={terms}>
                            <Link
                                href="#terms+services"
                                className="text-link-secondary text-nowrap"
                                onClick={(event) => {
                                    terms.current?.click();
                                    event.preventDefault();
                                }}
                            >
                                Terms & Conditions
                            </Link>
                        </CollapsibleTrigger>
                    </FieldDescription>
                    <CollapsibleContent asChild>
                        <FieldDescription className="pt-2 text-[0.5rem]">
                            Essentially, by registering your account with us, your soul, along with
                            your firstborn child, will henceforth belong solely to us. We are
                            definitely not an evil cabal of bloodsucking vampires and scheming
                            devils that have roamed this world for thousands of years and going, and
                            you agree to never make this claim or investigate it.
                        </FieldDescription>
                    </CollapsibleContent>
                </Collapsible>
            </FieldGroup>
        </form>
    );
}
