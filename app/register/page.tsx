"use client"

import { useState } from "react";
import { createUser } from "@/actions/createUser";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        createUser(email , password);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
                <h1 className="mb-2 text-center text-3xl font-extrabold tracking-wide text-orange-500">
                    Register
                </h1>
                <p className="text-center text-sm text-zinc-400 mb-8">
                    Create a new resume manager account
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg px-4 py-3 outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg px-4 py-3 outline-none transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold py-3 transition-colors cursor-pointer shadow-lg shadow-orange-950/20 mt-2"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account? 
                    <Link 
                        href="/login" 
                        className="text-orange-500 hover:text-orange-400 hover:underline font-medium transition-colors ml-1.5"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}