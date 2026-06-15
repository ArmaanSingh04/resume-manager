"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function updateLinkFile(
  linkId: number,
  newFileId: number | null,
  type?: "PUBLIC" | "PRIVATE"
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if link exists and belongs to user
  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { file: true },
  });

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized to update this link");
  }

  if (newFileId !== null) {
    // Check if new file belongs to user
    const newFile = await prisma.file.findUnique({
      where: { id: newFileId },
    });

    if (!newFile || newFile.userId !== Number(session.user.id)) {
      throw new Error("Unauthorized to use this file");
    }

    // Check if new file already has a link (excluding this link itself)
    const existingLink = await prisma.link.findUnique({
      where: { fileId: newFileId },
    });

    if (existingLink && existingLink.id !== linkId) {
      throw new Error("The selected file already has a share link");
    }
  }

  // Update the link
  const updatedLink = await prisma.link.update({
    where: { id: linkId },
    data: {
      fileId: newFileId,
      ...(type !== undefined ? { type } : {}),
    },
    include: {
      file: true,
    },
  });

  return {
    id: updatedLink.id,
    type: updatedLink.type,
    fileId: updatedLink.fileId,
    createdAt: updatedLink.createdAt.toISOString(),
    file: updatedLink.file
      ? {
          fileName: updatedLink.file.fileName,
          key: updatedLink.file.key,
        }
      : null,
  };
}
