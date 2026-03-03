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

    const tokenRaw = searchParams.get("token");
    const token = tokenRaw?.trim() || null;

    // better-auth may append an error code in query params
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // If token exists -> set new password mode, otherwise request reset mode
    const isTokenMode = !!token;

    // Use current origin in browser (no hardcoded localhost)
    const redirectTo = useMemo(() => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/reset-password`;
    }, []);

    async function submitRequestReset() {
        const trimmed = email.trim();

        if (!trimmed) {
            toast.error("Please enter your email");
            return;
        }

        // Must have redirectTo in browser. If user somehow submits before hydration, block safely.
        if (!redirectTo) {
            toast.error("Please try again");
            return;
        }

        const { error } = await authClient.requestPasswordReset({
            email: trimmed,
            redirectTo,
        });

        // Security: never reveal whether email exists
        if (error) {
            toast.success("If that email exists, a reset link will be sent.");
            return;
        }

        toast.success("If that email exists, a reset link has been sent.");
        setEmail("");
    }

    async function submitResetPassword() {
        if (!token) {
            toast.error("Reset token is missing. Please request a new link.");
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
        setNewPassword("");
        setConfirmPassword("");
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

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending || !email.trim()}
                        >
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

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                isPending ||
                                !newPassword ||
                                !confirmPassword ||
                                newPassword.length < 8 ||
                                newPassword !== confirmPassword
                            }
                        >
                            {isPending ? "Saving..." : "Reset password"}
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            Password must be at least 8 characters.
                        </p>
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
