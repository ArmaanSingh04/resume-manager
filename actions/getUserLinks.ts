"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function getUserLinks() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  const links = await prisma.link.findMany({
    where: {
      file: {
        userId: Number(session.user.id),
      },
    },
    include: {
      file: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return links;
}
