"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Download, FileText, X } from "lucide-react";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 text-zinc-400 gap-2 h-full bg-zinc-950">
      <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading PDF Viewer...</span>
    </div>
  ),
});

interface PdfViewerPanelProps {
  /** URL that serves the PDF inline */
  url: string;
  downloadUrl: string;
  fileName: string;
  /** Shows a back arrow linking here (e.g. owner returning to the dashboard) */
  backHref?: string;
  /** Shows a close button (used when the panel is inside a modal) */
  onClose?: () => void;
  /** id for the title element, so a dialog can reference it with aria-labelledby */
  titleId?: string;
}

/**
 * Google Drive style PDF viewer: top bar with file name and actions, and the
 * page viewer filling the remaining space. Fills its parent container.
 */
export default function PdfViewerPanel({ url, downloadUrl, fileName, backHref, onClose, titleId }: PdfViewerPanelProps) {
  // Standalone page gets the h1; inside a modal the page already has one
  const Title = onClose ? "h2" : "h1";

  return (
    <div className="h-full w-full bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
      {/* Top bar: file name on the left, actions on the right */}
      <header className="h-14 shrink-0 flex items-center justify-between gap-3 px-3 sm:px-4 bg-zinc-900 border-b border-zinc-800 z-40">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {backHref && (
            <Link
              href={backHref}
              title="Back to dashboard"
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div className="w-8 h-8 shrink-0 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <Title id={titleId} className="min-w-0 text-sm font-medium text-zinc-100 truncate" title={fileName}>
            {fileName}
          </Title>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={downloadUrl}
            title="Download"
            className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer text-xs shadow-lg shadow-orange-950/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close preview"
              aria-label="Close preview"
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full bg-zinc-950 overflow-hidden relative">
        <PdfViewer url={url} />
      </main>
    </div>
  );
}
