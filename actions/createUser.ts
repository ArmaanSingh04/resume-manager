"use server"

import prisma from "@/config/db";
import { Prisma } from "@/app/generated/prisma/client";

export type CreateUserResult = { ok: true } | { ok: false; error: string };

const EMAIL_TAKEN = "An account with this email already exists. Please sign in instead.";

export async function createUser(email: string, password: string): Promise<CreateUserResult> {
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !password) {
        return { ok: false, error: "Email and password are required." };
    }

    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existing) {
        return { ok: false, error: EMAIL_TAKEN };
    }

    try {
        await prisma.user.create({
            data: {
                email: trimmedEmail,
                password: password
            }
        });
    } catch (err) {
        // Two signups with the same email can both pass the check above.
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return { ok: false, error: EMAIL_TAKEN };
        }
        console.error("Failed to create user:", err);
        return { ok: false, error: "Something went wrong while creating your account. Please try again." };
    }

    return { ok: true };
}
