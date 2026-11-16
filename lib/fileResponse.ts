import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

interface FileResponseOptions {
  /** Serve as an attachment (download) instead of inline */
  download?: boolean;
  /** Optional Cache-Control header value */
  cacheControl?: string;
}

/**
 * Streams a stored file from R2 back to the client.
 * Callers are responsible for authorising access to the file first.
 */
export async function fileResponse(
  file: { key: string; fileName: string },
  { download = false, cacheControl }: FileResponseOptions = {}
) {
  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: "resume-manager",
        Key: file.key,
      })
    );

    if (!response.Body) {
      return new Response("File body not found", { status: 500 });
    }

    const disposition = download ? "attachment" : "inline";
    const isPdf = file.fileName.toLowerCase().endsWith(".pdf");
    const contentType = isPdf ? "application/pdf" : (response.ContentType || "application/octet-stream");

    // transformToByteArray() is part of the S3 SDK's stream response interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyBytes = await (response.Body as any).transformToByteArray();

    const headers = new Headers();
    headers.set("Content-Disposition", `${disposition}; filename="${encodeURIComponent(file.fileName)}"`);
    headers.set("Content-Type", contentType);
    if (cacheControl) headers.set("Cache-Control", cacheControl);

    return new Response(bodyBytes, { headers });
  } catch (error) {
    console.error("Error downloading file from R2:", error);
    return new Response("Error downloading file", { status: 500 });
  }
}
