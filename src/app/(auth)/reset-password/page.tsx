/**
 *  Author: Sabrina Bjurman
 *  Create Time: 2026-02-10 15:05:25
 *  Modified by: Sabrina Bjurman
 *  Modified time: 2026-02-11 11:10:49
 *  Description: Reset password page.
 */

"use server";

import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="w-full text-center">
            <ResetPasswordForm className="flex-1" />
        </div>
    );
}
