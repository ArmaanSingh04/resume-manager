import prisma from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import PdfShareView from "@/components/PdfShareView";

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const linkId = parseInt(id);

  if (isNaN(linkId)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-sans p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto border border-red-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
          <p className="text-zinc-400 text-sm mb-6">
            The link you are trying to access is malformed or invalid.
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { file: true },
  });

  if (!link) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-sans p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 mx-auto border border-orange-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Link Not Found</h1>
          <p className="text-zinc-400 text-sm mb-6">
            The shared link does not exist or has been deleted by the owner.
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const isOwner = !!(session?.user?.id && Number(session.user.id) === link.userId);

  if (link.type === "PRIVATE" && !isOwner) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-sans p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto border border-red-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">This Resume is Private</h1>
          <p className="text-zinc-400 text-sm mb-6">
            This resume is set to private by the owner. Only the owner can view this resume.
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!link.file) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-sans p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 mx-auto border border-orange-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">No Resume Found</h1>
          <p className="text-zinc-400 text-sm mb-6">
            No resume is currently attached to this share link. The owner may have deleted the file or has not linked it yet.
          </p>
          {isOwner && (
            <Link
              href="/dashboard"
              className="inline-block bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Go to Dashboard to Fix
            </Link>
          )}
        </div>
      </div>
    );
  }

  const isPdf = link.file.fileName.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return (
      <PdfShareView linkId={link.id} fileName={link.file.fileName} isOwner={isOwner} />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="relative bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
        {/* Document Icon Box */}
        <div className="w-20 h-20 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20 relative shadow-inner">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${link.type === "PUBLIC"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}
          >
            {link.type === "PUBLIC" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Public Share Link
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private Link (Owner Access)
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-zinc-150 break-all px-2">
          {link.file.fileName}
        </h1>

        <p className="text-zinc-500 text-xs mb-8">
          Shared on {new Date(link.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Download Button */}
        <a
          href={`/api/share/${link.id}`}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 group mb-4"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Resume
        </a>

        {isOwner && (
          <Link
            href="/dashboard"
            className="text-xs text-zinc-400 hover:text-orange-500 transition-colors font-medium border-t border-zinc-800/80 w-full pt-4 mt-2"
          >
            ← Go back to Dashboard
          </Link>
        )}
      </div>

      <div className="mt-8 text-center select-none text-zinc-650 text-xs">
        Powered by Resume Manager
      </div>
    </div>
  );
}
