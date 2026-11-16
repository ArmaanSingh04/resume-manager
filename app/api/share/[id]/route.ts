import prisma from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import { fileResponse } from "@/lib/fileResponse";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const linkId = parseInt(id);

  if (isNaN(linkId)) {
    return new Response("Invalid link ID", { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { file: true },
  });

  if (!link) {
    return new Response("Link not found", { status: 404 });
  }

  if (link.type === "PRIVATE") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || Number(session.user.id) !== link.userId) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  if (!link.file) {
    return new Response("No file attached to this link", { status: 404 });
  }

  return fileResponse(link.file, {
    download: req.nextUrl.searchParams.get("download") === "true",
  });
}
