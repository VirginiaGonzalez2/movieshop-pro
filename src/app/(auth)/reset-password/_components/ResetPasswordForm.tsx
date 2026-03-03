"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isTokenMode = !!token;

    const redirectTo = useMemo(() => {
        if (typeof window === "undefined") return "http://localhost:3000/reset-password";
        return `${window.location.origin}/reset-password`;
    }, []);

    async function submitRequestReset() {
        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        const { error } = await authClient.requestPasswordReset({
            email: email.trim(),
            redirectTo,
        });

        // For security: don't reveal whether email exists.
        if (error) {
            toast.error("If that email exists, a reset link will be sent.");
            return;
        }

        toast.success("If that email exists, a reset link has been sent.");
        setEmail("");
    }

    async function submitResetPassword() {
        if (!token) {
            toast.error("Missing token");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const { error } = await authClient.resetPassword({
            token,
            newPassword,
        });

        if (error) {
            toast.error("Reset link is invalid or expired");
            return;
        }

        toast.success("Password reset successfully. Please log in.");
        router.replace("/login");
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            if (isTokenMode) {
                await submitResetPassword();
            } else {
                await submitRequestReset();
            }
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    {isTokenMode ? "Set a new password" : "Reset your password"}
                </h1>

                {error === "INVALID_TOKEN" ? (
                    <p className="mt-2 text-sm text-red-600">
                        This reset link is invalid or expired. Please request a new one.
                    </p>
                ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isTokenMode
                            ? "Choose a new password for your account."
                            : "Enter your email and we’ll send you a reset link."}
                    </p>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                {!isTokenMode ? (
                    <>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Sending..." : "Send reset link"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : "Reset password"}
                        </Button>
                    </>
                )}
            </form>

            <div className="text-sm text-muted-foreground">
                <Link href="/login" className="underline">
                    Back to login
                </Link>
            </div>
        </div>
    );
}
