"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";

interface FeedbackInput {
  rating: number;
  mostUsedFeature: string;
  mostUsedOther?: string;
  feedbackType: string;
  comments: string;
  featureRequest?: string;
  recommend: string;
}

export async function submitFeedback(input: FeedbackInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  const feedback = await prisma.feedback.create({
    data: {
      rating: input.rating,
      mostUsedFeature: input.mostUsedFeature,
      mostUsedOther: input.mostUsedOther || null,
      feedbackType: input.feedbackType,
      comments: input.comments,
      featureRequest: input.featureRequest || null,
      recommend: input.recommend,
      userId: userId,
    },
  });

  return feedback;
}
