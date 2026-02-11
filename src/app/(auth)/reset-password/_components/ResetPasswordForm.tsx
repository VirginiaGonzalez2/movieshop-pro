import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"form">;

export function ResetPasswordForm({ className, ...rest }: Props) {
    return <form className={twMerge("", className)} {...rest}></form>;
}
