"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function deleteLink(linkId: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { file: true },
  });

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.file.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized to delete this link");
  }

  await prisma.link.delete({
    where: { id: linkId },
  });

  return { success: true };
}
