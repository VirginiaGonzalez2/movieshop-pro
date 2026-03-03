import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="mx-auto max-w-md p-8">
            <Suspense fallback={null}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
