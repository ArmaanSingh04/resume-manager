"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/config/db";

export async function getUserFiles(){
    const session = await getServerSession(authOptions)

    if(!session?.user?.id) return

    const files = await prisma.file.findMany({
        where: {
            userId: Number(session.user.id)
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return files;
}