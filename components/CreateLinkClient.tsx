"use client";

import { useState, useEffect } from "react";
import { createLink } from "@/actions/createLink";
import { deleteLink } from "@/actions/deleteLink";
import { updateLinkFile } from "@/actions/updateLinkFile";
import { ClientFile } from "./ManageResumesClient";

export interface ClientLink {
  id: number;
  type: "PUBLIC" | "PRIVATE";
  fileId: number | null;
  createdAt: string;
  file: {
    fileName: string;
    key: string;
  } | null;
}

interface CreateLinkClientProps {
  initialLinks: ClientLink[];
  initialFiles: ClientFile[];
}

export default function CreateLinkClient({ initialLinks, initialFiles }: CreateLinkClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [links, setLinks] = useState<ClientLink[]>(initialLinks);
  const [files] = useState<ClientFile[]>(initialFiles);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [linkType, setLinkType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  const [isUpdateLinkModalOpen, setIsUpdateLinkModalOpen] = useState(false);
  const [updatingLink, setUpdatingLink] = useState<ClientLink | null>(null);
  const [updateFileId, setUpdateFileId] = useState<string>("");
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [updateLinkType, setUpdateLinkType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const handleCreateLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileId) return;

    setIsCreatingLink(true);
    try {
      const newLink = await createLink(Number(selectedFileId), linkType);
      
      // Map it appropriately to ClientLink format
      const clientFormattedLink: ClientLink = {
        id: newLink.id,
        type: newLink.type,
        fileId: newLink.fileId,
        createdAt: newLink.createdAt,
        file: newLink.file ? {
          fileName: newLink.file.fileName,
          key: newLink.file.key
        } : null
      };

      setLinks((prev) => [clientFormattedLink, ...prev]);
      setIsCreateLinkModalOpen(false);
      setSelectedFileId("");
      setLinkType("PUBLIC");
    } catch (error) {
      console.error("Failed to create link:", error);
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    try {
      await deleteLink(linkId);
      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleCopyLink = (linkId: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(linkId);
    setTimeout(() => {
      setCopiedLinkId(null);
    }, 2000);
  };

  const handleUpdateLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingLink) return;

    setIsUpdatingLink(true);
    try {
      const updated = await updateLinkFile(
        updatingLink.id,
        updateFileId ? Number(updateFileId) : null,
        updateLinkType
      );
      
      const clientFormattedUpdated: ClientLink = {
        id: updated.id,
        type: updated.type,
        fileId: updated.fileId,
        createdAt: updated.createdAt,
        file: updated.file ? {
          fileName: updated.file.fileName,
          key: updated.file.key
        } : null
      };

      setLinks((prev) =>
        prev.map((link) => (link.id === updatingLink.id ? clientFormattedUpdated : link))
      );
      setIsUpdateLinkModalOpen(false);
      setUpdatingLink(null);
      setUpdateFileId("");
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      setIsUpdatingLink(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Container */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Create Link
        </h1>
        <button
          onClick={() => setIsCreateLinkModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-orange-950/20"
        >
          Create Link
        </button>
      </div>

      {/* Content Space */}
      {links.length === 0 ? (
        <div className="flex-1 rounded-xl bg-zinc-900/10 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 border border-orange-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">No share links created yet</h3>
          <p className="text-zinc-550 text-sm max-w-sm mb-6">
            Create share links to share your resumes with recruiters and managers.
          </p>
          <button
            onClick={() => setIsCreateLinkModalOpen(true)}
            className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/30 px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-semibold"
          >
            Create Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => {
            const shareUrl = mounted && typeof window !== "undefined" ? `${window.location.origin}/share/${link.id}` : "";
            return (
              <div
                key={link.id}
                className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-950/5 group relative overflow-visible"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
                
                <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-500/15 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </div>
                  
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border ${
                      link.fileId === null
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : link.type === "PUBLIC"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border-zinc-750"
                    }`}
                  >
                    {link.fileId === null ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        Not Working
                      </>
                    ) : link.type === "PUBLIC" ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Public Link
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private Link
                      </>
                    )}
                  </span>
                </div>

                <div className="flex-1 min-w-0 mb-4 relative z-10">
                  <h4 className="font-semibold text-zinc-100 truncate group-hover:text-orange-500 transition-colors" title={link.file ? link.file.fileName : "No resume attached (Broken Link)"}>
                    {link.file ? link.file.fileName : "No resume attached (Broken Link)"}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Created {mounted ? new Date(link.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : new Date(link.createdAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </p>
                </div>

                {/* Copy field */}
                <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 mb-4 z-10 select-none">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-transparent text-xs text-zinc-400 px-2 outline-none select-all truncate"
                  />
                  <button
                    onClick={() => handleCopyLink(link.id, shareUrl)}
                    className="bg-zinc-850 hover:bg-zinc-800 hover:text-white text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 min-w-[70px] text-center"
                  >
                    {copiedLinkId === link.id ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center gap-2 relative z-10 border-t border-zinc-800 pt-4 mt-auto">
                  <a
                    href={`/share/${link.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </a>
                  <button
                    onClick={() => {
                      setUpdatingLink(link);
                      setUpdateFileId(link.fileId ? link.fileId.toString() : "");
                      setUpdateLinkType(link.type);
                      setIsUpdateLinkModalOpen(true);
                    }}
                    className="flex-1 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Change
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="flex-1 bg-red-950/10 hover:bg-red-950/20 text-red-500 border border-red-500/20 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Link Modal Overlay */}
      {isCreateLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="text-lg font-bold text-orange-500 tracking-wide">
                Create Share Link
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCreateLinkModalOpen(false);
                  setSelectedFileId("");
                  setLinkType("PUBLIC");
                }}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Form */}
            {(() => {
              const filesWithoutLink = files.filter(
                (file) => !links.some((link) => link.fileId === file.id)
              );

              if (filesWithoutLink.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-800">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1">No Available Resumes</h4>
                    <p className="text-zinc-550 text-xs max-w-xs mb-4">
                      All your uploaded resumes already have share links, or you haven't uploaded any resumes yet.
                    </p>
                  </div>
                );
              }

              return (
                <form onSubmit={handleCreateLinkSubmit} className="flex flex-col gap-4">
                  {/* Select Resume */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="file-select" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Select Resume
                    </label>
                    <select
                      id="file-select"
                      required
                      value={selectedFileId}
                      onChange={(e) => setSelectedFileId(e.target.value)}
                      className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:border-orange-500/50 outline-none transition-colors"
                    >
                      <option value="" className="bg-zinc-900 text-zinc-100">-- Choose a Resume --</option>
                      {filesWithoutLink.map((file) => (
                        <option key={file.id} value={file.id} className="bg-zinc-900 text-zinc-100">
                          {file.fileName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Visibility
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLinkType("PUBLIC")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          linkType === "PUBLIC"
                            ? "bg-orange-600/10 border-orange-500 text-orange-500"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs font-bold">Public</span>
                        <span className="text-[10px] text-zinc-550 leading-tight">Anyone with the link can view</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLinkType("PRIVATE")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          linkType === "PRIVATE"
                            ? "bg-orange-600/10 border-orange-500 text-orange-500"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs font-bold">Private</span>
                        <span className="text-[10px] text-zinc-550 leading-tight">Only owner can view</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreatingLink || !selectedFileId}
                    className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 mt-2 flex items-center justify-center gap-2"
                  >
                    {isCreatingLink ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Link...</span>
                      </>
                    ) : (
                      <span>Generate Link</span>
                    )}
                  </button>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Update Link Modal Overlay */}
      {isUpdateLinkModalOpen && updatingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <span className="text-lg font-bold text-orange-500 tracking-wide">
                Change Resume for Link
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsUpdateLinkModalOpen(false);
                  setUpdatingLink(null);
                  setUpdateFileId("");
                }}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Form */}
            {(() => {
              const availableFiles = files.filter(
                (file) =>
                  file.id === updatingLink.fileId ||
                  !links.some((link) => link.fileId === file.id)
              );

              return (
                <form onSubmit={handleUpdateLinkSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                    <span className="font-semibold text-zinc-450 uppercase tracking-wider">Current Resume:</span>
                    <span className="text-zinc-200 truncate font-mono">{updatingLink.file ? updatingLink.file.fileName : "No resume attached (Broken Link)"}</span>
                  </div>

                  {/* Select Resume */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="update-file-select" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Select Resume
                    </label>
                    <select
                      id="update-file-select"
                      required
                      value={updateFileId}
                      onChange={(e) => setUpdateFileId(e.target.value)}
                      className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-100 text-sm focus:border-orange-500/50 outline-none transition-colors"
                    >
                      <option value="" className="bg-zinc-900 text-zinc-100">-- Choose a Resume --</option>
                      {availableFiles.map((file) => (
                        <option key={file.id} value={file.id} className="bg-zinc-900 text-zinc-100">
                          {file.fileName} {file.id === updatingLink.fileId ? "(Current)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility Type */}
                  <div className="flex flex-col gap-2 my-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Visibility
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUpdateLinkType("PUBLIC")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          updateLinkType === "PUBLIC"
                            ? "bg-orange-600/10 border-orange-500 text-orange-500"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs font-bold">Public</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpdateLinkType("PRIVATE")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          updateLinkType === "PRIVATE"
                            ? "bg-orange-600/10 border-orange-500 text-orange-500"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs font-bold">Private</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isUpdatingLink || !updateFileId || (Number(updateFileId) === updatingLink.fileId && updateLinkType === updatingLink.type)}
                    className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 mt-2 flex items-center justify-center gap-2"
                  >
                    {isUpdatingLink ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating Link...</span>
                      </>
                    ) : (
                      <span>Update Attached Resume</span>
                    )}
                  </button>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
