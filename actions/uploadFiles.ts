"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";

export async function uploadFiles(formData: FormData) {
    const files = formData.getAll("files") as File[];

    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return;
    }

    for(const file of files){
        if(file.size == 0) continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const key = `${session.user.id}/${crypto.randomUUID()}-${file.name}`;
        
        await r2.send(
            new PutObjectCommand({
                Bucket: "resume-manager",
                Key: key,
                Body: buffer,
                ContentType: file.type
            })
        );

        await prisma.file.create({
            data:{
                fileName: file.name,
                key: key,
                userId: Number(session.user.id)
            }
        })
    }
}
