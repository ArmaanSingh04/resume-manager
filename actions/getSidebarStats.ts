"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function getSidebarStats() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      totalResumes: 0,
      totalLinks: 0,
      totalViews: 0,
    };
  }

  const userId = Number(session.user.id);

  const [totalResumes, totalLinks, filesAggregate] = await Promise.all([
    prisma.file.count({
      where: { userId },
    }),
    prisma.link.count({
      where: { userId },
    }),
    prisma.file.aggregate({
      where: { userId },
      _sum: {
        totalViews: true,
      },
    }),
  ]);

  return {
    totalResumes,
    totalLinks,
    totalViews: filesAggregate._sum.totalViews || 0,
  };
}
