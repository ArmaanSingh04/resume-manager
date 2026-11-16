import prisma from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import { fileResponse } from "@/lib/fileResponse";

// Serves one of the signed-in user's own files (used by the dashboard preview).
// Unlike /api/share/[id], this does not go through a share link and does not record visits.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fileId = parseInt(id);

  if (isNaN(fileId)) {
    return new Response("Invalid file ID", { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  // Respond with 404 for other users' files so their existence isn't revealed
  if (!file || file.userId !== Number(session.user.id)) {
    return new Response("File not found", { status: 404 });
  }

  return fileResponse(file, {
    download: req.nextUrl.searchParams.get("download") === "true",
    // Each upload gets a unique storage key, so a file ID's content never changes
    cacheControl: "private, max-age=3600",
  });
}
