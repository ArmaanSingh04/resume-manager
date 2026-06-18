"use client";

import { useState } from "react";
import { uploadFiles } from "@/actions/uploadFiles";
import { getUserFiles } from "@/actions/getUserFiles";
import { deleteFile } from "@/actions/deleteFile";
import { getResumeStats } from "@/actions/getResumeStats";

export interface ClientFile {
  id: number;
  fileName: string;
  key: string;
  userId: number;
  createdAt: string;
}

interface ManageResumesClientProps {
  initialFiles: ClientFile[];
}

export default function ManageResumesClient({ initialFiles }: ManageResumesClientProps) {
  const [files, setFiles] = useState<ClientFile[]>(initialFiles);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedFileForStats, setSelectedFileForStats] = useState<ClientFile | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsData, setStatsData] = useState<{
    totalViews: number;
    uniqueVisitors: number;
    visitors: Array<{
      id: number;
      visitorId: string;
      views: number;
      firstVisit: string;
      lastVisit: string;
    }>;
  } | null>(null);

  const handleOpenStats = async (file: ClientFile) => {
    setSelectedFileForStats(file);
    setIsStatsOpen(true);
    setIsLoadingStats(true);
    setStatsData(null);
    try {
      const data = await getResumeStats(file.id);
      setStatsData(data);
    } catch (err) {
      console.error("Failed to load resume statistics:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleCloseStats = () => {
    setIsStatsOpen(false);
    setSelectedFileForStats(null);
    setStatsData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadFiles(formData);
      const rawFiles = await getUserFiles();
      const updatedFiles = rawFiles?.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        key: file.key,
        userId: file.userId,
        createdAt: file.createdAt.toISOString(),
      })) || [];

      setFiles(updatedFiles);
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Container */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Resumes Content Area */}
      {files.length === 0 ? (
        <div className="flex-1 rounded-xl bg-zinc-900/10 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 border border-orange-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">No resumes uploaded yet</h3>
          <p className="text-zinc-500 text-sm max-w-sm mb-6">
            Upload your resumes to manage and create sharing links.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/30 px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-semibold"
          >
            Upload Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-950/5 group relative overflow-visible"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

              {/* Options Button and Menu Panel */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === file.id ? null : file.id);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Options"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                </button>

                {activeMenuId === file.id && (
                  <>
                    {/* Backdrop overlay to close when clicking outside */}
                    <div
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                    />
                    {/* Dropdown Menu Panel */}
                    <div className="absolute right-0 mt-1.5 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          try {
                            await deleteFile(file.id);
                            setFiles((prev) => prev.filter((f) => f.id !== file.id));
                          } catch (err) {
                            console.error("Delete failed:", err);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-start gap-4 relative z-10 pr-6">
                <div className="w-12 h-12 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-500/15 shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-zinc-100 truncate group-hover:text-orange-500 transition-colors" title={file.fileName}>
                    {file.fileName}
                  </h4>
                  <p className="text-xs text-zinc-550 mt-1">
                    Uploaded {new Date(file.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Statistics button under card */}
              <div className="flex items-center gap-2 relative z-10 border-t border-zinc-800/80 pt-4 mt-4">
                <button
                  onClick={() => handleOpenStats(file)}
                  className="flex-1 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Statistics</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Choose Files Button in the Middle */}
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
                <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-colors text-sm text-center inline-block">
                  Choose Files
                  <input
                    type="file"
                    name="files"
                    multiple
                    disabled={isUploading}
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
                disabled={isUploading || selectedFiles.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 mt-2 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Panel Overlay */}
      {isStatsOpen && selectedFileForStats && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out cursor-pointer"
            onClick={handleCloseStats}
          />
          {/* Drawer Panel (slides in from right) */}
          <aside className="relative flex flex-col w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-6 transition-transform duration-300 ease-in-out z-10 animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6 shrink-0">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-lg font-bold text-orange-500 truncate block">
                  Resume Statistics
                </span>
                <span className="text-zinc-400 text-xs truncate block mt-0.5" title={selectedFileForStats.fileName}>
                  {selectedFileForStats.fileName}
                </span>
              </div>
              <button
                onClick={handleCloseStats}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="Close statistics menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stats Content */}
            {isLoadingStats ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
                <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Fetching statistics...</span>
              </div>
            ) : statsData ? (
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center text-center">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Views</span>
                    <span className="text-3xl font-extrabold text-orange-500">{statsData.totalViews}</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center text-center">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Unique Visitors</span>
                    <span className="text-3xl font-extrabold text-orange-500">{statsData.uniqueVisitors}</span>
                  </div>
                </div>

                {/* Visitor Log Section */}
                <div className="flex flex-col flex-1 min-h-0">
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 shrink-0">Visitor Log</h4>
                  
                  {statsData.visitors.length === 0 ? (
                    <div className="flex-1 bg-zinc-950/40 border border-zinc-800/60 rounded-xl flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                      <svg className="w-8 h-8 text-zinc-650 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A9.342 9.342 0 0012.458 10.22c-.67-.324-1.378-.543-2.12-.642m11.739 8.254a9.348 9.348 0 00-2.201-1.35M17.618 19.062A7.062 7.062 0 0115 17.202M9 19.128a9.38 9.38 0 01-2.625.372 9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128v.109A9.342 9.342 0 0112.458 10.22c.67-.324 1.378-.543 2.12-.642m-11.739 8.254a9.348 9.348 0 012.201-1.35M6.382 19.062A7.062 7.062 0 009 17.202m0 0a5.002 5.002 0 01-5-5c0-2.76 2.24-5 5-5s5 2.24 5 5a5.002 5.002 0 01-5 5z" />
                      </svg>
                      <span className="text-xs">No visitor logs recorded yet</span>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto border border-zinc-800 rounded-xl bg-zinc-950 divide-y divide-zinc-900">
                      {statsData.visitors.map((visitor, idx) => (
                        <div key={visitor.id} className="p-3.5 flex flex-col gap-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-zinc-300 font-semibold">
                              Visitor #{statsData.visitors.length - idx} (uuid: {visitor.visitorId.slice(0, 8)}...)
                            </span>
                            <span className="bg-orange-600/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold">
                              {visitor.views} {visitor.views === 1 ? "view" : "views"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-500 mt-1">
                            <span>First: {new Date(visitor.firstVisit).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                            <span>Last: {new Date(visitor.lastVisit).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
                Failed to load statistics
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
