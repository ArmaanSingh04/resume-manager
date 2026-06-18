"use server";

import { cookies } from "next/headers";
import prisma from "@/config/db";

export async function recordResumeVisit(fileId: number) {
  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get("visitor_id")?.value;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      // Set visitor_id cookie for 1 year
      cookieStore.set("visitor_id", visitorId, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    // Run in a database transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Find existing visitor for this file
      const visitor = await tx.fileVisitor.findUnique({
        where: {
          fileId_visitorId: {
            fileId,
            visitorId: visitorId!,
          },
        },
      });

      if (!visitor) {
        // First visit: unique visitor
        await tx.fileVisitor.create({
          data: {
            fileId,
            visitorId: visitorId!,
            views: 1,
          },
        });

        await tx.file.update({
          where: { id: fileId },
          data: {
            totalViews: { increment: 1 },
            uniqueVisitors: { increment: 1 },
          },
        });
      } else {
        // Returning visit
        await tx.fileVisitor.update({
          where: {
            fileId_visitorId: {
              fileId,
              visitorId: visitorId!,
            },
          },
          data: {
            views: { increment: 1 },
            lastVisit: new Date(),
          },
        });

        await tx.file.update({
          where: { id: fileId },
          data: {
            totalViews: { increment: 1 },
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error recording resume visit:", error);
    return { success: false, error: "Failed to record visit" };
  }
}
