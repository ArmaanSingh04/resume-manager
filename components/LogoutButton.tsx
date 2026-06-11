"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() =>
                signOut({
                    callbackUrl: "/",
                })
            }
            className="rounded bg-red-500 px-4 py-2 text-white cursor-pointer"
        >
            Logout
        </button>
    );
}