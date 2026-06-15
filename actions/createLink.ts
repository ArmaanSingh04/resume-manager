"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function createLink(fileId: number, type: "PUBLIC" | "PRIVATE") {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if file belongs to user
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file || file.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized to create link for this file");
  }

  // Check if link already exists for this file
  const existingLink = await prisma.link.findUnique({
    where: { fileId },
  });

  if (existingLink) {
    throw new Error("A link already exists for this file");
  }

  const link = await prisma.link.create({
    data: {
      fileId,
      type,
    },
    include: {
      file: true,
    },
  });

  return {
    id: link.id,
    type: link.type,
    fileId: link.fileId,
    createdAt: link.createdAt.toISOString(),
    file: {
      fileName: link.file.fileName,
      key: link.file.key,
    },
  };
}
