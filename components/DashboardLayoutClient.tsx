"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LogoutButton from "./LogoutButton";

interface DashboardLayoutClientProps {
  session: {
    user?: {
      email?: string | null;
    } | null;
  } | null;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ session, children }: DashboardLayoutClientProps) {
  const pathname = usePathname();

  const isManageActive = pathname === "/dashboard";
  const isCreateActive = pathname === "/dashboard/create-link";

  return (
    <div className="min-h-screen bg-zinc-955 text-zinc-100 flex font-sans overflow-hidden">
      {/* Sidebar Navigation (visible on sm and larger screens) */}
      <aside className="hidden sm:flex bg-zinc-900 border-r border-zinc-800 flex-col w-64 shrink-0 justify-between">
        <nav className="p-4 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${isManageActive
                ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
              }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span>Manage Resumes</span>
          </Link>
          <Link
            href="/dashboard/create-link"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${isCreateActive
                ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
              }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span>Create Link</span>
          </Link>
        </nav>

        {/* User profile / Logout bottom container */}
        <div className="p-4 border-t border-zinc-800 flex flex-col gap-2.5 bg-zinc-900/40">
          {session?.user?.email && (
            <span className="text-xs text-zinc-400 truncate font-medium px-1 block" title={session.user.email}>
              {session.user.email}
            </span>
          )}
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-zinc-955 p-6 sm:p-8 flex flex-col overflow-y-auto pb-28 sm:pb-8">
        {children}
      </main>

      {/* Bottom Navigation Bar (visible only on mobile/narrow screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 flex flex-col">
        {session?.user?.email && (
          <div className="text-[10px] text-zinc-500 text-center py-1.5 border-b border-zinc-850/50 truncate px-4">
            Logged in as: {session.user.email}
          </div>
        )}
        <nav className="h-16 flex justify-around items-center px-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all cursor-pointer rounded-lg ${isManageActive ? "text-orange-500 bg-orange-600/5" : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-[10px] font-medium tracking-wide">Resumes</span>
          </Link>

          <Link
            href="/dashboard/create-link"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all cursor-pointer rounded-lg ${isCreateActive ? "text-orange-500 bg-orange-600/5" : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className="text-[10px] font-medium tracking-wide">Links</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center justify-center flex-1 py-1.5 transition-all cursor-pointer rounded-lg text-zinc-400 hover:text-red-400"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span className="text-[10px] font-medium tracking-wide">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
