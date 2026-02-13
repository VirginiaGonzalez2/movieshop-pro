/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-12 08:45:41
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-12 16:34:52
 *  Description: Reset password form.
 */

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordFormSchema, ResetPasswordFormValues } from "@/form-schemas/reset-password";
import { useOriginRouter } from "@/hooks/use-origin-router";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"form">;

export function ResetPasswordForm({ className, ...rest }: Props) {
    const router = useOriginRouter(true);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    async function handleSubmit(values: ResetPasswordFormValues) {
        console.log(values);

        // TODO
        //const { error } = await authClient.resetPassword();
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
                <FieldLegend>Restore Password</FieldLegend>
                <FieldDescription>DESCRIPTION</FieldDescription>
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
                </FieldSet>
                <Field className="justify-between">
                    <Button type="submit">Send Recovery Link</Button>
                </Field>
                <Field>
                    <FieldDescription>
                        Click{" "}
                        <Link
                            replace
                            href={router.formatUrl("/login")}
                            className="text-link-primary"
                        >
                            here
                        </Link>{" "}
                        to return to login
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}
