"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Minus, PanelLeftClose, PanelLeftOpen, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use CDN worker to avoid configuration issues with Turbopack/Webpack
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MAX_PAGE_WIDTH = 800;
const MIN_PAGE_WIDTH = 240;
const THUMB_WIDTH = 128;
// Approximate page aspect ratio (US Letter) used for loading placeholders
const PAGE_RATIO = 11 / 8.5;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.1;
// Gap left above a page when jumping to it
const PAGE_SCROLL_OFFSET = 24;
const DESKTOP_QUERY = "(min-width: 768px)";

interface PdfViewerProps {
  url: string;
}

const isDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  // Thumbnails start open on desktop and collapsed on small screens
  const [sidebarOpen, setSidebarOpen] = useState(() => isDesktop());

  // The scroll container only mounts once the document has loaded, so track it via state
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbListRef = useRef<HTMLDivElement>(null);
  // While a thumbnail-triggered smooth scroll runs, don't let intermediate positions move the highlight
  const isNavigating = useRef(false);

  const pageNumbers = numPages ? Array.from({ length: numPages }, (_, i) => i + 1) : [];

  // Fit pages to the available width (debounced so the sidebar animation doesn't re-render every frame)
  useEffect(() => {
    if (!scrollEl) return;

    let timer: number | undefined;
    let isFirst = true;

    const observer = new ResizeObserver(([entry]) => {
      const next = Math.max(Math.min(Math.floor(entry.contentRect.width), MAX_PAGE_WIDTH), MIN_PAGE_WIDTH);
      if (isFirst) {
        isFirst = false;
        setContainerWidth(next);
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setContainerWidth(next), 150);
    });

    observer.observe(scrollEl);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [scrollEl]);

  // Track which page is currently in view
  useEffect(() => {
    if (!scrollEl || !numPages) return;

    let frame = 0;
    let idleTimer: number | undefined;

    const update = () => {
      frame = 0;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;

      if (scrollTop + clientHeight >= scrollHeight - 4) {
        setCurrentPage(numPages);
        return;
      }

      const containerTop = scrollEl.getBoundingClientRect().top;
      const threshold = clientHeight * 0.4;
      let page = 1;
      for (let i = 0; i < numPages; i++) {
        const el = pageRefs.current[i];
        if (el && el.getBoundingClientRect().top - containerTop <= threshold) page = i + 1;
      }
      setCurrentPage(page);
    };

    const onScroll = () => {
      if (isNavigating.current) {
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          isNavigating.current = false;
          update();
        }, 150);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
    };
  }, [scrollEl, numPages]);

  // Keep the active thumbnail visible inside the sidebar
  useEffect(() => {
    if (!sidebarOpen) return;
    const list = thumbListRef.current;
    const thumb = thumbRefs.current[currentPage - 1];
    if (!list || !thumb) return;

    const listRect = list.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    if (thumbRect.top < listRect.top) {
      list.scrollBy({ top: thumbRect.top - listRect.top - 12, behavior: "smooth" });
    } else if (thumbRect.bottom > listRect.bottom) {
      list.scrollBy({ top: thumbRect.bottom - listRect.bottom + 12, behavior: "smooth" });
    }
  }, [currentPage, sidebarOpen]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      const el = pageRefs.current[pageNumber - 1];
      if (!scrollEl || !el) return;

      const top =
        el.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop - PAGE_SCROLL_OFFSET;

      isNavigating.current = true;
      setCurrentPage(pageNumber);
      scrollEl.scrollTo({ top, behavior: "smooth" });

      // On small screens the thumbnail panel overlays the document, so close it after picking a page
      if (!isDesktop()) setSidebarOpen(false);
    },
    [scrollEl]
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    pageRefs.current = [];
    thumbRefs.current = [];
    setCurrentPage(1);
    setNumPages(numPages);
  }

  const zoomOut = () => setScale((prev) => Math.max(Math.round((prev - SCALE_STEP) * 10) / 10, MIN_SCALE));
  const zoomIn = () => setScale((prev) => Math.min(Math.round((prev + SCALE_STEP) * 10) / 10, MAX_SCALE));

  const pageWidth = containerWidth ? containerWidth * scale : 0;

  return (
    <Document
      file={url}
      onLoadSuccess={onDocumentLoadSuccess}
      onItemClick={({ pageNumber }) => goToPage(pageNumber)}
      className="relative flex h-full w-full overflow-hidden bg-zinc-950"
      loading={
        <div className="absolute inset-0 flex items-center justify-center p-12 text-zinc-400 gap-2">
          <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading PDF...</span>
        </div>
      }
      error={
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="p-8 text-red-500 font-medium text-center bg-red-500/10 border border-red-500/20 rounded-xl max-w-md">
            Failed to load PDF. Please click the download button in the top right to view this file.
          </div>
        </div>
      }
    >
      {/* Thumbnail sidebar: pushes content on desktop, overlays it on mobile */}
      <aside
        aria-label="Page thumbnails"
        className={cn(
          "absolute inset-y-0 left-0 z-30 md:relative flex flex-col shrink-0 h-full bg-zinc-900 border-r border-zinc-800 overflow-hidden transition-[width] duration-300 ease-out",
          sidebarOpen ? "w-52 shadow-2xl shadow-black/60 md:shadow-none" : "w-12"
        )}
      >
        <div
          ref={thumbListRef}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 scrollbar-thin [scrollbar-color:#35353c_transparent]",
            !sidebarOpen && "invisible"
          )}
        >
          {/* Fixed inner width so thumbnails don't reflow while the panel animates */}
          <div className="w-44 flex flex-col items-center gap-5">
            <div className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <span>Pages</span>
              <span>{numPages}</span>
            </div>

            {pageNumbers.map((pageNumber) => {
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={`thumb_${pageNumber}`}
                  ref={(el) => {
                    thumbRefs.current[pageNumber - 1] = el;
                  }}
                  type="button"
                  onClick={() => goToPage(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex flex-col items-center gap-2 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                >
                  <div
                    className={cn(
                      "rounded-sm overflow-hidden ring-2 transition-all duration-200 shadow-lg shadow-black/40",
                      isActive ? "ring-orange-600" : "ring-transparent group-hover:ring-zinc-600"
                    )}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={THUMB_WIDTH}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div
                          className="bg-zinc-800 animate-pulse"
                          style={{ width: THUMB_WIDTH, height: THUMB_WIDTH * PAGE_RATIO }}
                        />
                      }
                    />
                  </div>
                  <span
                    className={cn(
                      "min-w-6 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors",
                      isActive ? "bg-orange-600 text-zinc-950" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  >
                    {pageNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapse toggle pinned to the bottom of the panel */}
        <div className="shrink-0 border-t border-zinc-800 p-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-expanded={sidebarOpen}
            title={sidebarOpen ? "Collapse page thumbnails" : "Show page thumbnails"}
            className="h-8 w-full flex items-center gap-2.5 px-2 rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-zinc-800 transition-colors cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4 shrink-0" /> : <PanelLeftOpen className="w-4 h-4 shrink-0" />}
            <span className={cn("text-xs font-medium whitespace-nowrap", !sidebarOpen && "sr-only")}>
              {sidebarOpen ? "Collapse" : "Show pages"}
            </span>
          </button>
        </div>
      </aside>

      {/* Dim the document behind the overlay panel on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden absolute inset-0 z-20 bg-black/60"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="relative flex-1 min-w-0 h-full ml-12 md:ml-0">
        <div
          ref={setScrollEl}
          className="h-full overflow-auto overscroll-contain px-4 pt-6 pb-28 md:px-8 md:pt-8 scrollbar-thin [scrollbar-color:#35353c_transparent]"
        >
          {/* w-max lets zoomed pages overflow horizontally; min-w-full keeps them centred otherwise */}
          <div className="w-max min-w-full flex flex-col items-center gap-6">
            {containerWidth &&
              pageNumbers.map((pageNumber) => (
                <div
                  key={`page_${pageNumber}`}
                  ref={(el) => {
                    pageRefs.current[pageNumber - 1] = el;
                  }}
                  className="rounded-sm overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={containerWidth}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div
                        className="bg-zinc-900 animate-pulse"
                        style={{ width: pageWidth, height: pageWidth * PAGE_RATIO }}
                      />
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Floating page indicator + zoom controls (Google Drive style) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl shadow-black/50 text-sm select-none whitespace-nowrap">
          <span className="px-3 text-zinc-400" aria-live="polite">
            <span className="hidden sm:inline">Page </span>
            <span className="font-semibold text-orange-500">{currentPage}</span>
            <span className="mx-1 text-zinc-600">/</span>
            <span className="text-zinc-300">{numPages}</span>
          </span>

          <span className="w-px h-5 bg-zinc-800" />

          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            title="Zoom out"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-orange-500 hover:bg-zinc-800 transition-colors cursor-pointer disabled:text-zinc-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <span className="min-w-12 text-center font-semibold text-zinc-200 tabular-nums">{Math.round(scale * 100)}%</span>

          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            title="Zoom in"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-orange-500 hover:bg-zinc-800 transition-colors cursor-pointer disabled:text-zinc-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <span className="w-px h-5 bg-zinc-800" />

          <button
            type="button"
            onClick={() => setScale(1)}
            disabled={scale === 1}
            title="Reset zoom"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-orange-500 hover:bg-zinc-800 transition-colors cursor-pointer disabled:text-zinc-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Document>
  );
}
