"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

export async function hasSubmittedFeedback() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return false;
  }

  const userId = Number(session.user.id);

  const feedbackCount = await prisma.feedback.count({
    where: {
      userId: userId,
    },
  });

  return feedbackCount > 0;
}
