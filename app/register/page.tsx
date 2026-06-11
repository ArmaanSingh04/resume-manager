"use client"

import { useState } from "react";
import { createUser } from "@/actions/createUser";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        createUser(email , password);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-center text-2xl font-bold">
            Register
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium">
                Email
                </label>

                <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                Password
                </label>

                <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
                Register
            </button>
            </form>
        </div>
        </div>
    );
}