"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    title?: string;
}

export default function LogoutButton({ className, children, title }: LogoutButtonProps) {
    return (
        <button
            onClick={() =>
                signOut({
                    callbackUrl: "/",
                })
            }
            className={className || "rounded bg-red-500 px-4 py-2 text-white cursor-pointer"}
            title={title}
        >
            {children || "Logout"}
        </button>
    );
}