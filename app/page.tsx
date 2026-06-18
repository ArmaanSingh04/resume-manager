import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-600/30 selection:text-orange-500 overflow-x-hidden">
      {/* Navigation Bar */}
      <header className="w-full flex justify-center py-6 px-4">
        <nav className="w-[92%] sm:w-[85%] md:w-[60%] bg-zinc-900 border border-zinc-800 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-lg shadow-black/40 backdrop-blur-md">
          {/* Left Section: Spacer to maintain center alignment */}
          <div className="flex-1" />

          {/* Center Section: Main links */}
          <div className="flex items-center gap-2 sm:gap-4 justify-center">
            <Link
              href="#how-to-use"
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-[#111010] hover:bg-orange-600 px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              How to use?
            </Link>
            <Link
              href="#about-us"
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-[#111010] hover:bg-orange-600 px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              About us
            </Link>
          </div>

          {/* Right Section: Github & Login Button */}
          <div className="flex-1 flex justify-end items-center gap-3 sm:gap-4">
            <a
              href="https://github.com/ArmaanSingh04/resume-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer flex items-center shrink-0"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4 sm:w-5 h-5 fill-current" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            {session ? (
              <Link
                href="/dashboard"
                className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-[#111010] font-semibold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-lg shadow-orange-950/20 shrink-0"
              >
                GO TO APP
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-[#111010] font-semibold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-lg shadow-orange-950/20 shrink-0"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section Container */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mx-auto py-16 md:py-24 max-w-full">
        {/* Main Title */}
        <h1 className="text-[5.5vw] sm:text-[4.5vw] md:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-100 mb-6 leading-tight whitespace-nowrap">
          Share Your <span className="text-orange-600 font-extrabold">Resume</span>. On Your <span className="text-orange-600 font-extrabold">Terms</span>.
        </h1>

        {/* Description (Triangle shape) */}
        <p className="text-base sm:text-xl md:text-2xl text-zinc-400 leading-relaxed mb-10 max-w-5xl px-2 text-center">
          Upload, organize, and manage <span className="text-white font-medium">all your resumes</span> in one place. Create <span className="text-white font-medium">secure public or private links</span>,
          <span className="text-white font-medium">update documents anytime</span>, and share your professional
          profile with confidence.
        </p>

        {/* Call to Action Button */}
        {session ? (
          <Link
            href="/dashboard"
            className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-[#111010] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all cursor-pointer text-base sm:text-lg shadow-xl shadow-orange-950/30"
          >
            Go to your Dashboard
          </Link>
        ) : (
          <Link
            href="/register"
            className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-[#111010] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all cursor-pointer text-base sm:text-lg shadow-xl shadow-orange-950/30"
          >
            Get Started
          </Link>
        )}
      </main>
    </div>
  );
}
