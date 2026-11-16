"use client";

import PdfViewerPanel from "@/components/PdfViewerPanel";

interface PdfShareViewProps {
  linkId: number;
  fileName: string;
  isOwner: boolean;
}

export default function PdfShareView({ linkId, fileName, isOwner }: PdfShareViewProps) {
  return (
    <div className="h-dvh w-screen">
      <PdfViewerPanel
        url={`/api/share/${linkId}`}
        downloadUrl={`/api/share/${linkId}?download=true`}
        fileName={fileName}
        backHref={isOwner ? "/dashboard" : undefined}
      />
    </div>
  );
}
