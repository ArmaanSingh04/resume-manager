"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";

export async function deleteFile(fileId: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  if (file.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized to delete this file");
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: "resume-manager",
        Key: file.key,
      })
    );
  } catch (error) {
    console.error("Error deleting from R2:", error);
  }

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });

  return { success: true };
}
