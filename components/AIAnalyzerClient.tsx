"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { extractResumeText } from "@/actions/extractResumeText";

interface Recommendation {
  priority: string;
  title: string;
  description: string;
}

interface AnalysisResult {
  overallScore: number;
  scores: {
    ats: number;
    experience: number;
    projects: number;
    skills: number;
    readability: number;
  };
  summary: {
    candidateLevel: string;
    primaryDomain: string;
    assessment: string;
  };
  skills: {
    detected: string[];
    strongest: string[];
    missing: string[];
  };
  atsAnalysis: {
    detectedSections: string[];
    missingSections: string[];
    issues: string[];
  };
  jobMatch: {
    provided: boolean;
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    assessment: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  recruiterPerspective: {
    wouldInterview: boolean;
    reason: string;
  };
}

export default function AIAnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Stored analysis result
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [rawJobDesc, setRawJobDesc] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const result = await extractResumeText(formData);

      // Save states
      setRawText(result.extractedText);
      setRawJobDesc(result.jobDescription);
      setAnalysis(result.analysis as AnalysisResult);

      // Print extracted text and job description to browser console
      console.log("Resume received successfully");
      console.log("Extracted Resume Text:", result.extractedText);
      console.log("Job Description:", result.jobDescription);
    } catch (error: any) {
      console.error("Failed to analyze resume:", error);
      const errMsg = error?.message || String(error);
      alert(`Error parsing resume file: ${errMsg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/30";
    if (score >= 60) return "text-amber-500 border-amber-500/30";
    return "text-rose-500 border-rose-500/30";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full justify-start py-4">
      {/* Page Header */}
      <div className="mb-6 text-center sm:text-left flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center justify-center sm:justify-start gap-2.5">
            <svg className="w-7 h-7 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.813M21 3L9.813 14.187M21 3l-8 12.187m8-12.187v8m0-8h-8" />
            </svg>
            AI Resume Analyzer
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Compare your resume with a target job description using gpt-4o-mini.
          </p>
        </div>

        {analysis && (
          <button
            onClick={() => {
              setAnalysis(null);
              setRawText(null);
              setRawJobDesc(null);
            }}
            className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Analyze Another
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-stretch justify-center">
        {isAnalyzing ? (
          /* Analyzing State */
          <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 my-12">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-1.5 tracking-wide">
              Analyzing...
            </h3>
            <p className="text-zinc-550 text-xs">
              Sending resume metadata to OpenAI gpt-4o-mini
            </p>
          </div>
        ) : !analysis ? (
          /* Input and Upload Form in Middle of Screen */
          <div className="w-full max-w-xl bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-md self-center">
            
            {/* File Dropzone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Upload Resume (PDF preferred)
              </label>
              
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={onButtonClick}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-orange-500 bg-orange-600/5"
                      : "border-zinc-800 bg-zinc-950/40 hover:border-orange-500/40 hover:bg-zinc-900/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,.doc"
                    onChange={handleChange}
                  />
                  <svg className="w-10 h-10 text-zinc-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0016.5 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-sm font-bold text-zinc-200">Drag & drop your file or browse</span>
                  <span className="text-xs text-zinc-500 mt-1">Supports PDF, DOCX, TXT up to 10MB</span>
                </div>
              ) : (
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-orange-600/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg hover:bg-zinc-850 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Job Description Input Box */}
            <div className="flex flex-col gap-2">
              <label htmlFor="job-description" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Job Description (Optional)
              </label>
              <textarea
                id="job-description"
                rows={4}
                placeholder="Paste the target job description here to assess compatibility..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:border-orange-500/60 outline-none transition-colors resize-none placeholder-zinc-700"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file}
              className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.813M21 3L9.813 14.187M21 3l-8 12.187m8-12.187v8m0-8h-8" />
              </svg>
              <span>Analyze Resume</span>
            </button>
          </div>
        ) : (
          /* Results Dashboard displaying analyzed data */
          <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom duration-300">
            
            {/* Top Scores & Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Circular Gauge Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0,transparent_60%)] pointer-events-none" />
                <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center relative shadow-2xl bg-zinc-950/40 ${getScoreColor(analysis.overallScore)}`}>
                  <span className="text-4xl font-extrabold font-mono tracking-tight">{analysis.overallScore}</span>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest mt-1">Overall Score</span>
                </div>
                
                {/* Level / Domain pill */}
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300">
                    {analysis.summary.candidateLevel}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300">
                    {analysis.summary.primaryDomain}
                  </span>
                </div>
              </div>

              {/* Subscores breakdown Progress Bars */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-lg md:col-span-2">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Metric Scores</h3>
                
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "ATS Compatibility", val: analysis.scores.ats },
                    { label: "Experience Quality", val: analysis.scores.experience },
                    { label: "Projects Quality", val: analysis.scores.projects },
                    { label: "Skills Alignment", val: analysis.scores.skills },
                    { label: "Readability & Format", val: analysis.scores.readability },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-300">{item.label}</span>
                        <span className="font-mono text-zinc-100">{item.val}/100</span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-850">
                        <div
                          className={`h-full ${getProgressColor(item.val)}`}
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recruiter Assessment & Interview decision */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-3">
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Recruiter Perspective
                </h3>
                
                {analysis.recruiterPerspective.wouldInterview ? (
                  <span className="text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Would Interview
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Passed / No Interview
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-3 text-sm leading-relaxed">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Overall Assessment Summary</h4>
                  <p className="text-zinc-300">{analysis.summary.assessment}</p>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Recruiter Decision Reasoning</h4>
                  <p className="text-zinc-300">{analysis.recruiterPerspective.reason}</p>
                </div>
              </div>
            </div>

            {/* Job Match Section (Conditionally rendered) */}
            {analysis.jobMatch.provided && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Job Description Match Analysis
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold font-mono border ${getScoreColor(analysis.jobMatch.matchScore)}`}>
                    Match Score: {analysis.jobMatch.matchScore}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Matched Keywords / Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.jobMatch.matchedKeywords.length === 0 ? (
                          <span className="text-xs text-zinc-550 italic">No matching keywords detected.</span>
                        ) : (
                          analysis.jobMatch.matchedKeywords.map((kw, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                              {kw}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Missing Required Keywords / Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.jobMatch.missingKeywords.length === 0 ? (
                          <span className="text-xs text-zinc-550 italic">No missing keywords identified.</span>
                        ) : (
                          analysis.jobMatch.missingKeywords.map((kw, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
                              {kw}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 h-full flex flex-col">
                    <span className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-2">Match Assessment</span>
                    <p className="text-xs text-zinc-300 leading-relaxed overflow-y-auto">
                      {analysis.jobMatch.assessment}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills & ATS Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Skills Analysis */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Skills Evaluation
                </h3>

                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-450 uppercase tracking-wider">Strongest Areas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.skills.strongest.length === 0 ? (
                        <span className="text-zinc-555 italic">None listed.</span>
                      ) : (
                        analysis.skills.strongest.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-450 uppercase tracking-wider">Missing Core Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.skills.missing.length === 0 ? (
                        <span className="text-zinc-555 italic">None.</span>
                      ) : (
                        analysis.skills.missing.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-400">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-450 uppercase tracking-wider">Detected Skills</span>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto bg-zinc-950/30 p-2 rounded-lg border border-zinc-850">
                      {analysis.skills.detected.length === 0 ? (
                        <span className="text-zinc-555 italic">None detected.</span>
                      ) : (
                        analysis.skills.detected.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400">
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS Checker */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                  ATS Structural Analysis
                </h3>

                <div className="flex flex-col gap-4 text-xs">
                  {/* Detected Sections */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-450 uppercase tracking-wider">Detected Sections</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.atsAnalysis.detectedSections.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-850 text-emerald-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Sections */}
                  {analysis.atsAnalysis.missingSections.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-zinc-450 uppercase tracking-wider">Missing Standard Sections</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.atsAnalysis.missingSections.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-850 text-amber-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formatting / Parsing Issues */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-zinc-450 uppercase tracking-wider">Detected Formatting / ATS Issues</span>
                    <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto bg-zinc-950/30 p-2 rounded-lg border border-zinc-850">
                      {analysis.atsAnalysis.issues.length === 0 ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          ✓ No structural issues found. Nice!
                        </span>
                      ) : (
                        analysis.atsAnalysis.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-zinc-400">
                            <span className="text-rose-500 font-bold leading-none select-none">•</span>
                            <span>{issue}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Strengths */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
                <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Key Strengths
                </h3>
                <div className="flex flex-col gap-2.5 mt-2">
                  {analysis.strengths.length === 0 ? (
                    <span className="text-zinc-550 italic text-xs">No key strengths extracted.</span>
                  ) : (
                    analysis.strengths.map((str, i) => (
                      <div key={i} className="bg-zinc-950/30 border border-zinc-850/50 p-3 rounded-xl flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-zinc-300 text-xs leading-relaxed">{str}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
                <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Areas of Improvement
                </h3>
                <div className="flex flex-col gap-2.5 mt-2">
                  {analysis.weaknesses.length === 0 ? (
                    <span className="text-zinc-550 italic text-xs">No specific weaknesses identified.</span>
                  ) : (
                    analysis.weaknesses.map((weak, i) => (
                      <div key={i} className="bg-zinc-950/30 border border-zinc-850/50 p-3 rounded-xl flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-zinc-300 text-xs leading-relaxed">{weak}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
              <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Actionable Recommendations
              </h3>

              <div className="flex flex-col gap-3">
                {analysis.recommendations.length === 0 ? (
                  <span className="text-zinc-550 italic text-xs">No recommendations needed. Excellent resume!</span>
                ) : (
                  analysis.recommendations.map((rec, i) => {
                    const isHigh = rec.priority?.toLowerCase() === "high";
                    const isMed = rec.priority?.toLowerCase() === "medium";
                    
                    const badgeClass = isHigh
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : isMed
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300";

                    const borderClass = isHigh
                      ? "border-rose-500/20 hover:border-rose-500/40"
                      : isMed
                      ? "border-amber-500/20 hover:border-amber-500/40"
                      : "border-zinc-800 hover:border-zinc-700";

                    return (
                      <div key={i} className={`bg-zinc-950/40 border p-4 rounded-xl flex flex-col gap-2.5 transition-colors ${borderClass}`}>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h4 className="font-semibold text-zinc-200 text-sm">{rec.title}</h4>
                          <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${badgeClass}`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Collapsible raw text inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 opacity-60 hover:opacity-100 transition-opacity">
              <details className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-4 cursor-pointer text-xs">
                <summary className="font-bold text-zinc-450 uppercase tracking-wider select-none">
                  View Raw Extracted Resume Text
                </summary>
                <div className="mt-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-900 max-h-48 overflow-y-auto text-[10px] font-mono whitespace-pre-wrap text-zinc-550 leading-relaxed cursor-text select-text">
                  {rawText}
                </div>
              </details>

              <details className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-4 cursor-pointer text-xs">
                <summary className="font-bold text-zinc-450 uppercase tracking-wider select-none">
                  View Raw Job Description
                </summary>
                <div className="mt-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-900 max-h-48 overflow-y-auto text-[10px] font-mono whitespace-pre-wrap text-zinc-550 leading-relaxed cursor-text select-text">
                  {rawJobDesc || "No job description entered."}
                </div>
              </details>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
