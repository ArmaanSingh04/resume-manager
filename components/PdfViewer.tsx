"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use CDN worker to avoid configuration issues with Turbopack/Webpack
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [scale, setScale] = useState<number>(1.0);


  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          // Adjust width by taking into account page padding and layout margins
          const adjustedWidth = Math.min(entry.contentRect.width - 32, 800);
          setContainerWidth(adjustedWidth > 0 ? adjustedWidth : 320);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center w-full h-full overflow-auto p-4 md:p-6 bg-zinc-950 gap-6 relative" ref={containerRef}>
      {/* Floating Zoom Controls (Google Drive Style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full shadow-2xl flex items-center gap-4 text-sm select-none">
        <button
          type="button"
          onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
          disabled={scale <= 0.5}
          className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md shadow-orange-950/20 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:shadow-none"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>

        <span className="text-zinc-200 font-semibold min-w-[50px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.5))}
          disabled={scale >= 2.5}
          className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md shadow-orange-950/20 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:shadow-none"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {scale !== 1.0 && (
          <>
            <span className="w-px h-4 bg-zinc-800" />
            <button
              type="button"
              onClick={() => setScale(1.0)}
              className="text-xs text-orange-500 hover:text-orange-400 font-semibold cursor-pointer px-1 transition-colors"
              title="Reset Zoom"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {/* Center container with custom min-width for overflow horizontal scrolling */}
      <div 
        style={{ minWidth: scale > 1 ? `${containerWidth * scale}px` : "auto" }} 
        className="flex flex-col items-center gap-6"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-12 text-zinc-400 gap-2">
              <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading PDF...</span>
            </div>
          }
          error={
            <div className="p-8 text-red-500 font-medium text-center bg-red-500/10 border border-red-500/20 rounded-xl max-w-md">
              Failed to load PDF. Please click the download button in the top right to view this file.
            </div>
          }
        >
          {numPages &&
            Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="border border-zinc-800 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl p-2 max-w-full"
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={containerWidth}
                  scale={scale}
                  className="max-w-full"
                />
              </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
