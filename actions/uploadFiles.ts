"use server"

import prisma from "@/config/db";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFiles(formData: FormData) {
    const files = formData.getAll("files") as File[];

    for(const file of files){
        if(file.size == 0) continue;

        const buffer = Buffer.from(await file.arrayBuffer());

        await r2.send(
            new PutObjectCommand({
                Bucket: "resume-manager",
                Key: "2",
                Body: buffer,
                ContentType: file.type
            })
        );

        
    }
}
