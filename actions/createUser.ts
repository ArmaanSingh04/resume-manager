"use server"

import prisma from "@/config/db";

export async function createUser(email: string , password: string){
    await prisma.user.create({
        data:{
            email: email,
            password: password
        }
    })
}
