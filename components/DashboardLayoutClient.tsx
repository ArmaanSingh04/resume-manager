"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isManageActive = pathname === "/dashboard";
  const isCreateActive = pathname === "/dashboard/create-link";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
      {/* Mobile Header Bar */}
      <header className="sm:hidden h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg tracking-tight text-zinc-100">Resume Manager</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (visible on sm and larger screens) */}
        <aside
          className={`hidden sm:flex bg-zinc-900 border-r border-zinc-800 flex-col shrink-0 justify-between transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex flex-col">
            {/* Sidebar Header with Brand and Hamburger inside left panel */}
            <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} border-b border-zinc-800/50 min-h-[60px]`}>
              {!isCollapsed && (
                <span className="font-bold text-lg tracking-tight text-zinc-100 truncate">
                  Resume Manager
                </span>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-3 flex flex-col gap-1.5">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  isCollapsed ? "justify-center px-0" : "px-4"
                } ${
                  isManageActive
                    ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
                }`}
                title={isCollapsed ? "Manage Resumes" : undefined}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {!isCollapsed && <span className="text-sm">Manage Resumes</span>}
              </Link>
              <Link
                href="/dashboard/create-link"
                className={`flex items-center gap-3 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  isCollapsed ? "justify-center px-0" : "px-4"
                } ${
                  isCreateActive
                    ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
                }`}
                title={isCollapsed ? "Create Link" : undefined}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                {!isCollapsed && <span className="text-sm">Create Link</span>}
              </Link>
            </nav>
          </div>

          {/* User profile / Logout bottom container */}
          <div className="p-3 border-t border-zinc-800 flex flex-col gap-2.5 bg-zinc-900/40 justify-end">
            {session?.user?.email && !isCollapsed && (
              <span className="text-xs text-zinc-400 truncate font-medium px-1 block" title={session.user.email}>
                {session.user.email}
              </span>
            )}
            {isCollapsed ? (
              <LogoutButton className="flex items-center justify-center p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors w-10 h-10 mx-auto cursor-pointer" title="Logout">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </LogoutButton>
            ) : (
              <LogoutButton />
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex sm:hidden">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer Panel */}
            <aside className="relative flex flex-col w-64 max-w-xs bg-zinc-900 h-full border-r border-zinc-800 p-4 transition-transform duration-300 ease-in-out z-10 animate-in slide-in-from-left">
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col">
                  {/* Header with Title and Hamburger close button inside */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50 mb-4">
                    <span className="font-bold text-lg tracking-tight text-zinc-100">Resume Manager</span>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
                      aria-label="Close navigation menu"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                        isManageActive
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
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                        isCreateActive
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
                </div>

                {/* User profile / Logout bottom container */}
                <div className="p-3 border-t border-zinc-800 flex flex-col gap-2.5 bg-zinc-900/40">
                  {session?.user?.email && (
                    <span className="text-xs text-zinc-400 truncate font-medium px-1 block" title={session.user.email}>
                      {session.user.email}
                    </span>
                  )}
                  <LogoutButton />
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-zinc-950 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
