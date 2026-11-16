"use client";

import { useId } from "react";
import ModalDialog from "@/components/ModalDialog";
import PdfViewerPanel from "@/components/PdfViewerPanel";

interface PdfPreviewModalProps {
  fileId: number;
  fileName: string;
  /** Called after the dialog has closed (close button, Escape or backdrop click) */
  onClose: () => void;
}

export default function PdfPreviewModal({ fileId, fileName, onClose }: PdfPreviewModalProps) {
  const titleId = useId();

  return (
    <ModalDialog onClose={onClose} labelledBy={titleId} className="p-0 sm:p-4 md:p-6">
      {(close) => (
        <div className="h-full w-full max-w-6xl overflow-hidden sm:rounded-2xl sm:border border-zinc-800 shadow-2xl shadow-black/60 transition-[opacity,scale] duration-200 ease-out starting:opacity-0 starting:scale-[0.98]">
          <PdfViewerPanel
            url={`/api/files/${fileId}`}
            downloadUrl={`/api/files/${fileId}?download=true`}
            fileName={fileName}
            onClose={close}
            titleId={titleId}
          />
        </div>
      )}
    </ModalDialog>
  );
}
