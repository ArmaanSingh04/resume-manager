"use client";

import { useEffect, useId, useState } from "react";
import { BarChart3, Clock, Eye, RotateCcw, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getResumeStats } from "@/actions/getResumeStats";
import ModalDialog from "@/components/ModalDialog";

type ResumeStats = Awaited<ReturnType<typeof getResumeStats>>;

interface ResumeStatsModalProps {
  fileId: number;
  fileName: string;
  /** Called after the modal has closed */
  onClose: () => void;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

function timeAgo(iso: string, now: number) {
  const diffSeconds = (new Date(iso).getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return "just now";
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const VISITOR_GRID = "grid grid-cols-2 sm:grid-cols-[minmax(0,1.3fr)_1fr_1fr_5rem] gap-x-4";

export default function ResumeStatsModal({ fileId, fileName, onClose }: ResumeStatsModalProps) {
  const titleId = useId();
  const [result, setResult] = useState<{ stats: ResumeStats; fetchedAt: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    getResumeStats(fileId)
      .then((stats) => {
        if (!ignore) setResult({ stats, fetchedAt: Date.now() });
      })
      .catch((err) => {
        console.error("Failed to load resume statistics:", err);
        if (!ignore) setFailed(true);
      });
    return () => {
      ignore = true;
    };
  }, [fileId, attempt]);

  const retry = () => {
    setFailed(false);
    setAttempt((n) => n + 1);
  };

  return (
    <ModalDialog onClose={onClose} labelledBy={titleId}>
      {(close) => (
        <div className="w-full max-w-3xl max-h-full sm:max-h-[85dvh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden text-zinc-100 font-sans transition-[opacity,scale] duration-200 ease-out starting:opacity-0 starting:scale-[0.98]">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 id={titleId} className="text-lg font-bold text-orange-500 leading-tight">
                  Resume Statistics
                </h2>
                <p className="text-zinc-400 text-xs truncate mt-0.5" title={fileName}>
                  {fileName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close statistics"
              title="Close"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin p-5 sm:p-6">
            {failed ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
                <p className="text-red-500 text-sm font-medium">Failed to load statistics</p>
                <button
                  type="button"
                  onClick={retry}
                  className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/30 px-4 py-2 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try again
                </button>
              </div>
            ) : !result ? (
              <StatsSkeleton />
            ) : (
              <StatsContent stats={result.stats} now={result.fetchedAt} />
            )}
          </div>
        </div>
      )}
    </ModalDialog>
  );
}

function StatsContent({ stats, now }: { stats: ResumeStats; now: number }) {
  const { visitors } = stats;
  // Visitors arrive sorted by last visit; number them by first visit so a visitor keeps the same number
  const visitorNumbers = new Map(
    [...visitors]
      .sort((a, b) => new Date(a.firstVisit).getTime() - new Date(b.firstVisit).getTime())
      .map((v, i) => [v.id, i + 1])
  );
  const lastViewed = visitors[0]?.lastVisit;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={Eye} label="Total Views" value={stats.totalViews.toLocaleString()} />
        <StatCard icon={Users} label="Unique Visitors" value={stats.uniqueVisitors.toLocaleString()} />
        <StatCard
          icon={Clock}
          label="Last Viewed"
          value={lastViewed ? timeAgo(lastViewed, now) : "—"}
          hint={lastViewed ? formatDateTime(lastViewed) : "Not viewed yet"}
          className="col-span-2 sm:col-span-1"
          compact
        />
      </div>

      {/* Visitor log */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Visitor Log</h3>
          {visitors.length > 0 && (
            <span className="text-[11px] font-semibold text-zinc-500">
              {visitors.length} {visitors.length === 1 ? "visitor" : "visitors"}
            </span>
          )}
        </div>

        {visitors.length === 0 ? (
          <div className="bg-zinc-950/40 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-200">No visitors yet</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Share a link to this resume and every view will show up here.
            </p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <div
              className={`${VISITOR_GRID} hidden sm:grid px-4 py-2.5 border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-500`}
            >
              <span>Visitor</span>
              <span>First visit</span>
              <span>Last visit</span>
              <span className="text-right">Views</span>
            </div>

            <ul className="divide-y divide-zinc-800/70">
              {visitors.map((visitor) => {
                const number = visitorNumbers.get(visitor.id);
                return (
                  <li
                    key={visitor.id}
                    className={`${VISITOR_GRID} gap-y-1 items-center px-4 py-3 text-xs hover:bg-zinc-900/60 transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 text-zinc-300 font-semibold flex items-center justify-center tabular-nums">
                        {number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-zinc-200 font-semibold">Visitor #{number}</p>
                        <p className="font-mono text-zinc-500 truncate" title={visitor.visitorId}>
                          {visitor.visitorId.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <span className="justify-self-end sm:order-last bg-orange-600/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold whitespace-nowrap tabular-nums">
                      {visitor.views} {visitor.views === 1 ? "view" : "views"}
                    </span>

                    <p className="col-span-2 sm:col-span-1 pl-11 sm:pl-0 text-zinc-400">
                      <span className="sm:hidden text-zinc-500">First: </span>
                      {formatDateTime(visitor.firstVisit)}
                    </p>
                    <p className="col-span-2 sm:col-span-1 pl-11 sm:pl-0 text-zinc-400">
                      <span className="sm:hidden text-zinc-500">Last: </span>
                      {formatDateTime(visitor.lastVisit)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string;
  /** Smaller value text for longer values such as relative times */
  compact?: boolean;
}

function StatCard({ icon: Icon, label, value, hint, className = "", compact = false }: StatCardProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-2 ${className}`}>
      <span className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span
        className={`font-extrabold text-orange-500 tabular-nums leading-none ${compact ? "text-xl sm:text-2xl" : "text-3xl"}`}
      >
        {value}
      </span>
      {hint && <span className="text-[11px] text-zinc-500 truncate">{hint}</span>}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" aria-busy="true" aria-label="Loading statistics">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-7 w-14 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-24 rounded bg-zinc-800" />
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl divide-y divide-zinc-800/70">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 w-24 rounded bg-zinc-800" />
                <div className="h-2.5 w-16 rounded bg-zinc-800/70" />
              </div>
              <div className="h-5 w-14 rounded-full bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
