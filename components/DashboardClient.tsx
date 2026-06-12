"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import { uploadFiles } from "@/actions/uploadFiles";

interface DashboardClientProps {
  session: {
    user?: {
      email?: string | null;
    } | null;
  } | null;
}

type TabType = "manage-resumes" | "create-link";

export default function DashboardClient({ session }: DashboardClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("manage-resumes");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleUpload = () => {
    console.log('upload fired')
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // const handleFormSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handleUpload();
  //   setIsUploadModalOpen(false);
  //   setSelectedFiles([]);
  // };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button (No Icons, Pure CSS Bars) */}
          <button
            onClick={toggleSidebar}
            className="flex flex-col justify-between w-6 h-5 cursor-pointer group"
            aria-label="Toggle Sidebar"
          >
            <span className="w-6 h-0.5 bg-orange-500 transition-all duration-300 group-hover:bg-orange-400"></span>
            <span className="w-6 h-0.5 bg-orange-500 transition-all duration-300 group-hover:bg-orange-400"></span>
            <span className="w-6 h-0.5 bg-orange-500 transition-all duration-300 group-hover:bg-orange-400"></span>
          </button>

          <span className="text-xl font-bold tracking-wider text-orange-500">
            DASHBOARD
          </span>
        </div>

        <div className="flex items-center gap-4">
          {session?.user?.email && (
            <span className="text-sm text-zinc-400 hidden sm:inline">
              {session.user.email}
            </span>
          )}
          <LogoutButton />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
            }`}
        >
          <nav className="p-4 flex flex-col gap-2 flex-1">
            <button
              onClick={() => setActiveTab("manage-resumes")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "manage-resumes"
                ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
            >
              Manage Resumes
            </button>
            <button
              onClick={() => setActiveTab("create-link")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "create-link"
                ? "bg-orange-600/10 text-orange-500 border border-orange-500/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
            >
              Create Link
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-zinc-950 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {activeTab === "manage-resumes" ? (
            <div className="flex flex-col h-full">
              {/* Header Container */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                  Manage Resumes
                </h1>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-950/20"
                >
                  Upload Resume
                </button>
              </div>

              {/* Content Space (Empty, no dummy data) */}
              <div className="flex-1 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600 text-sm tracking-wider uppercase">
                  Content Area
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header Container */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                  Create Link
                </h1>
                <button className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-950/20">
                  Create Link
                </button>
              </div>

              {/* Content Space (Empty, no dummy data) */}
              <div className="flex-1 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600 text-sm tracking-wider uppercase">
                  Content Area
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal Overlay */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="text-lg font-bold text-orange-500 tracking-wide">
                Upload Resumes
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFiles([]);
                }}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Form */}
            <form action={uploadFiles} className="flex flex-col gap-4">
              {/* Choose Files Button in the Middle */}
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
                <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-colors text-sm text-center inline-block">
                  Choose Files
                  <input
                    type="file"
                    name="files"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-zinc-500 text-xs mt-2.5">
                  Select one or multiple files
                </span>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto border border-zinc-800 rounded-lg p-3 bg-zinc-950">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Selected Files ({selectedFiles.length}):
                  </span>
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-zinc-300 truncate py-1 border-b border-zinc-900/50 last:border-b-0"
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button at Bottom */}
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-950/20 mt-2"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
