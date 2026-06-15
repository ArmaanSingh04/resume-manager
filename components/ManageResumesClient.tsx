"use client";

import { useState } from "react";
import { uploadFiles } from "@/actions/uploadFiles";
import { getUserFiles } from "@/actions/getUserFiles";
import { deleteFile } from "@/actions/deleteFile";

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
                  <p className="text-xs text-zinc-500 mt-1">
                    Uploaded {new Date(file.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
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
    </div>
  );
}
