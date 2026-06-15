"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 text-zinc-400 gap-2 min-h-screen bg-zinc-950">
      <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading PDF Viewer...</span>
    </div>
  ),
});

interface PdfShareViewProps {
  linkId: number;
  fileName: string;
  isOwner: boolean;
}

export default function PdfShareView({ linkId, fileName, isOwner }: PdfShareViewProps) {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden relative">
      {/* Floating Download Button on the Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <a
          href={`/api/share/${linkId}?download=true`}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer text-xs shadow-lg shadow-orange-950/20 flex items-center gap-1.5 border border-orange-500/20 backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>

        </a>
      </div>

      {/* Main Content Area - Full screen Google Drive rendering with app background and react-pdf */}
      <main className="flex-1 w-full h-full bg-zinc-950 overflow-hidden relative">
        <PdfViewer url={`/api/share/${linkId}`} />
      </main>
    </div>
  );
}
