import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import prisma from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

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

  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: "resume-manager",
        Key: link.file.key,
      })
    );

    if (!response.Body) {
      return new Response("File body not found", { status: 500 });
    }

    const download = req.nextUrl.searchParams.get("download") === "true";
    const disposition = download ? "attachment" : "inline";

    const isPdf = link.file.fileName.toLowerCase().endsWith(".pdf");
    const contentType = isPdf ? "application/pdf" : (response.ContentType || "application/octet-stream");

    // transformToByteArray() is part of the S3 SDK's stream response interface
    const bodyBytes = await (response.Body as any).transformToByteArray();

    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(link.file.fileName)}"`
    );
    headers.set("Content-Type", contentType);

    return new Response(bodyBytes, { headers });
  } catch (error) {
    console.error("Error downloading file from R2:", error);
    return new Response("Error downloading file", { status: 500 });
  }
}
