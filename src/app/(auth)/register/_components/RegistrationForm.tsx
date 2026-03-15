"use client";

import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { registrationFormSchema, RegistrationFormValues } from "@/form-schemas/registration";
import { authClient } from "@/lib/auth-client";
import { useOriginRouter } from "@/hooks/use-origin-router";

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

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { FieldContinueWithLabel } from "@/components/ui-custom-shadcn/FieldContinueWithLabel";

import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"form">;

export function RegistrationForm({ className, ...rest }: Props) {
  const router = useOriginRouter(true);
  const terms = useRef<HTMLButtonElement>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const originUrl = router.getOrigin();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(values: RegistrationFormValues) {
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const error = result?.error;
      const user = result?.data?.user;

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Registration successful! Please verify your email.");

      // Redirige según rol
      if (user && (user as any).role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile"); // o la ruta de usuario normal
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={twMerge(
        "p-4 border-2 max-w-[420px] rounded-xl flex flex-col justify-center items-center gap-2",
        className
      )}
      {...rest}
    >
      <FieldGroup className="justify-center">
        <FieldLegend>Registration</FieldLegend>

        <FieldDescription>
          Buy or rent the best and worst movies of all time. Registering your account with
          us is free.
        </FieldDescription>

        {/* NAME */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input {...field} id={field.name} autoComplete="name" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* EMAIL */}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
              <Input {...field} id={field.name} type="email" autoComplete="email" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* PASSWORD */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input {...field} id={field.name} type="password" autoComplete="new-password" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* CONFIRM PASSWORD */}
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <Input {...field} id={field.name} type="password" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
          <p className="text-sm">
            Already have an account?{" "}
            <Link href={router.formatUrl("/login")} className="text-link-primary">
              Click here to log in
            </Link>
          </p>
        </FieldContent>

        {mounted && (
          <Collapsible>
            <FieldDescription className="text-xs">
              For less information about how we definitely don&apos;t use your data, do
              not read our non-existing{" "}
              <CollapsibleTrigger ref={terms}>
                <Link
                  href="#terms+services"
                  className="text-link-secondary"
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
              <FieldDescription className="pt-2 text-[0.6rem]">
                Essentially, by registering your account with us, your soul, along with
                your firstborn child, will henceforth belong solely to us.
              </FieldDescription>
            </CollapsibleContent>
          </Collapsible>
        )}
      </FieldGroup>
    </form>
  );
}