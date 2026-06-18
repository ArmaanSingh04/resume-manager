"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function getResumeStats(fileId: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      visitors: {
        orderBy: {
          lastVisit: "desc",
        },
      },
    },
  });

  if (!file || file.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized");
  }

  return {
    totalViews: file.totalViews,
    uniqueVisitors: file.uniqueVisitors,
    visitors: file.visitors.map((v) => ({
      id: v.id,
      visitorId: v.visitorId,
      views: v.views,
      firstVisit: v.firstVisit.toISOString(),
      lastVisit: v.lastVisit.toISOString(),
    })),
  };
}
