import React, { useState, useEffect } from "react";
import { 
  Paper, 
  CrossPaperAnalysis, 
  IdeationResult, 
  LiteratureReview 
} from "./types";
import { 
  SAMPLE_PAPERS, 
  DEFAULT_CROSS_ANALYSIS, 
  DEFAULT_IDEATIONS, 
  DEFAULT_LIT_REVIEW 
} from "./sampleData";
import IndividualPaperInspector from "./components/IndividualPaperInspector";
import TrendAnalysisChart from "./components/TrendAnalysisChart";
import GapFinderPanel from "./components/GapFinderPanel";
import LiteratureReviewGenerator from "./components/LiteratureReviewGenerator";
import AddPaperModal from "./components/AddPaperModal";

import { 
  BookOpen, 
  Layers, 
  Compass, 
  FileText, 
  Plus, 
  Sparkles, 
  Settings, 
  Trash2, 
  Info,
  KeyRound,
  GraduationCap,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  // Application Data States
  const [papers, setPapers] = useState<Paper[]>(SAMPLE_PAPERS);
  const [selectedPaperId, setSelectedPaperId] = useState<string>("vaswani2017");
  const [activeWorkspace, setActiveWorkspace] = useState<"inspector" | "cross_synthesis" | "gap_finder" | "lit_review">("inspector");
  
  // Synthesized Results States
  const [analysis, setAnalysis] = useState<CrossPaperAnalysis>(DEFAULT_CROSS_ANALYSIS);
  const [ideation, setIdeation] = useState<IdeationResult>(DEFAULT_IDEATIONS);
  const [activeReview, setActiveReview] = useState<LiteratureReview>(DEFAULT_LIT_REVIEW);
  
  // System States
  const [serverMode, setServerMode] = useState<"demo" | "live" | "checking">("checking");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);

  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Active Selected Paper
  const selectedPaper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  // Fetch status on mount
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setServerMode("live");
        } else {
          setServerMode("demo");
        }
      })
      .catch((err) => {
        console.error("Status check failed, defaulting to demo:", err);
        setServerMode("demo");
      });
  }, []);

  // Handler 1: Ingesting a paper (PDF base64 or custom raw text)
  const handleIngestPaper = async (
    fileName: string, 
    fileType: "pdf" | "text", 
    content: { textContent?: string; pdfBase64?: string }
  ) => {
    try {
      const response = await fetch("/api/analyze-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileType,
          textContent: content.textContent,
          pdfBase64: content.pdfBase64,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to parse publication.");
      }

      const data = await response.json();
      if (data.success && data.paper) {
        const newPaper: Paper = data.paper;
        
        // Append new paper to papers array
        setPapers((prev) => {
          const updated = [...prev, newPaper];
          // Auto-select newly ingested paper
          setSelectedPaperId(newPaper.id);
          return updated;
        });

        // Trigger a gentle system notification / update
        console.log("Successfully ingested and modeled:", newPaper.title);
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  // Handler 2: Synthesize entire active paper shelf
  const handleSynthesizeCorpus = async () => {
    if (papers.length === 0) return;
    setSynthesizing(true);
    try {
      const response = await fetch("/api/synthesize-papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to compile corpus analysis.");
      }

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
        setIdeation(data.ideation);
        // Switch to synthesis/gaps workspace
        setActiveWorkspace("cross_synthesis");
      }
    } catch (err) {
      console.error(err);
      alert("Corpus synthesis failed. Check console or server logs.");
    } finally {
      setSynthesizing(false);
    }
  };

  // Handler 3: Generate customized literature review draft
  const handleGenerateReview = async (focus: string) => {
    try {
      const response = await fetch("/api/generate-literature-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers, focus }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate literature review.");
      }

      const data = await response.json();
      if (data.success && data.review) {
        setActiveReview(data.review);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Handler 4: Delete a paper (users can clear custom uploaded papers)
  const handleDeletePaper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPapers((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      // Fallback selection if active selected paper was deleted
      if (selectedPaperId === id) {
        const remaining = filtered[0];
        setSelectedPaperId(remaining ? remaining.id : "");
      }
      return filtered;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none antialiased flex flex-col transition-colors duration-250">
      
      {/* 1. Header Banner - High Density Format */}
      <header className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 sticky top-0 z-40 shrink-0">
        
        {/* Logo Title */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-700 rounded flex items-center justify-center text-white font-bold text-xs">
            LR
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            LitReview.ai <span className="text-slate-400 dark:text-slate-550 font-normal ml-2 italic text-xs uppercase tracking-widest">Research Engine</span>
          </h1>
        </div>

        {/* Mode Toggles & Server status */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-350 hover:bg-slate-150 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer flex items-center justify-center h-7 w-7"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to primary light theme" : "Switch to midnight dark theme"}
          >
            {isDark ? <Sun size={13.5} className="text-amber-400" /> : <Moon size={13.5} />}
          </button>

          {serverMode === "live" ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-850 text-emerald-800 dark:text-emerald-300 font-medium shadow-3xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450">Application Status Active</span>
            </div>
          ) : serverMode === "demo" ? (
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200 dark:border-amber-850 text-amber-800 dark:text-amber-300 font-medium shadow-3xs" title="Running with local smart synthesis template. Set GEMINI_API_KEY inside Secrets panel for live model processing.">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-450">Demo Sandbox Mode</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Initializing connection...</span>
          )}

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={13} />
            Ingest Paper
          </button>
        </div>

      </header>

      {/* 2. Main Content Board */}
      <main className="flex-1 w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch overflow-hidden">
        
        {/* Left Hand: Paper Shelf Column (Sidebar) - spans 3 cols */}
        <section className="lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs flex-1 flex flex-col justify-between min-h-[400px]">
            <div>
              
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-slate-400 dark:text-slate-500 tracking-wider">
                  <GraduationCap size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Papers Shelf</span>
                </div>
                <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-bold">
                  {papers.length} files
                </span>
              </div>

              {/* Upload Action */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full rounded bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-120 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 mb-3 cursor-pointer transition-all"
              >
                <Plus size={13} />
                + Upload Research Papers
              </button>

              {/* PDF Papers Shelf Scrolllist */}
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {papers.length > 0 ? (
                  papers.map((p) => {
                    const isSelected = p.id === selectedPaperId;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPaperId(p.id)}
                        className={`group text-left p-2.5 rounded border cursor-pointer transition relative flex justify-between items-start gap-2 ${
                          isSelected
                            ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold"
                            : "border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-serif font-bold leading-tight truncate text-slate-900 dark:text-slate-100">
                            {p.title}
                          </h3>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            <span className="truncate">
                              {p.authors[0]} {p.authors.length > 1 ? "et al." : ""} • {p.year}
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 ml-1">Analyzed</span>
                          </div>
                          <div className="flex gap-1 mt-1.5 select-none overflow-hidden">
                            {p.topics.slice(0, 2).map((top) => (
                              <span key={top} className="text-[8px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">
                                #{top.replace(/\s+/g, "")}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Delete button (only allow deletion for non-samples or custom uploads) */}
                        {p.fileType !== "sample" && (
                          <button
                            onClick={(e) => handleDeletePaper(p.id, e)}
                            className="text-slate-400 hover:text-red-650 dark:hover:text-red-400 p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                            title="Remove file"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-8">
                    Your collection is currently empty.
                  </p>
                )}
              </div>
            </div>

            {/* Synthesize Compilation Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-2">
              <button
                onClick={handleSynthesizeCorpus}
                disabled={synthesizing || papers.length === 0}
                className="w-full rounded bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-slate-950 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-3xs"
              >
                <Sparkles size={13} className="text-slate-950" />
                {synthesizing ? "Synthesizing Gaps..." : "Synthesize Corpus Gaps"}
              </button>
              
              <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center leading-normal">
                Refreshes cross-paper insights, topic clustering maps & contradictions.
              </div>
            </div>

          </div>

          {/* Setup Help Prompt banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-600 dark:text-slate-400 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold uppercase text-[9px] tracking-wider">
              <KeyRound size={12} />
              <span>Full-Stack AI Integration</span>
            </div>
            <p className="leading-tight text-[10px] text-slate-500 dark:text-slate-400">
              The application processes files natively on the server. If running in <strong>Demo Sandbox</strong>, you can add your custom API Key in the <strong>Settings &gt; Secrets</strong> panel in Google AI Studio to unlock live real-time Gemini analyzing capabilities.
            </p>
          </div>
        </section>

        {/* Right Hand: Workspace Core Frame - spans 9 cols */}
        <section className="lg:col-span-9 flex flex-col space-y-4">
          
          {/* Workspace Tab navigation - Compact High Density Design */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex rounded-lg gap-1 shadow-3xs" id="nav-workspaces">
            <button
              onClick={() => setActiveWorkspace("inspector")}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeWorkspace === "inspector"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <BookOpen size={13} />
              Paper Inspector
            </button>
            <button
              onClick={() => setActiveWorkspace("cross_synthesis")}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeWorkspace === "cross_synthesis"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Layers size={13} />
              Topic Clusters & Trends
            </button>
            <button
              onClick={() => setActiveWorkspace("gap_finder")}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeWorkspace === "gap_finder"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Compass size={13} />
              Research Gaps / Ideation
            </button>
            <button
              onClick={() => setActiveWorkspace("lit_review")}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeWorkspace === "lit_review"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <FileText size={13} />
              Literature Review Engine
            </button>
          </div>

          {/* Tab Work Panel Container */}
          <div className="flex-1">
            
            {activeWorkspace === "inspector" && (
              selectedPaper ? (
                <IndividualPaperInspector paper={selectedPaper} />
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-500 shadow-xs">
                  <Info size={32} className="text-slate-300 dark:text-slate-605 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Select or upload an academic publication from the sidebar shelf to analyze details.</p>
                </div>
              )
            )}

            {activeWorkspace === "cross_synthesis" && (
              <TrendAnalysisChart papers={papers} trends={analysis.trends} />
            )}

            {activeWorkspace === "gap_finder" && (
              <GapFinderPanel papers={papers} analysis={analysis} ideation={ideation} />
            )}

            {activeWorkspace === "lit_review" && (
              <LiteratureReviewGenerator 
                papers={papers} 
                activeReview={activeReview} 
                onGenerate={handleGenerateReview} 
              />
            )}

          </div>

        </section>

      </main>

      {/* 3. Footer branding - Compact High Density status bar */}
      <footer className="h-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 flex items-center px-4 justify-between text-[10px] text-slate-500 dark:text-slate-450 shrink-0">
        <div>Project: <span className="font-bold dark:text-slate-300">Arctic_Synthesis_2026</span></div>
        <div className="flex gap-4">
          <span>System Latency: 420ms</span>
          <span>Tokens: Active RAG Pipeline</span>
          <span className="font-mono">v1.2.6-stable</span>
        </div>
      </footer>

      {/* Upload/Ingest Paper Dialog Modal */}
      <AddPaperModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onIngest={handleIngestPaper}
      />

    </div>
  );
}
