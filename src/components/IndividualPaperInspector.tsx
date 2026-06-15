import React, { useState } from "react";
import { Paper } from "../types";
import { 
  BookOpen, 
  Settings, 
  Award, 
  AlertCircle, 
  Copy, 
  Check, 
  Share2, 
  Quote 
} from "lucide-react";

interface Props {
  paper: Paper;
}

export default function IndividualPaperInspector({ paper }: Props) {
  const [activeTab, setActiveTab] = useState<"summary" | "methodology" | "results" | "limitations">("summary");
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "bibtex">("apa");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="paper-inspector" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
      {/* Paper Information Banner */}
      <div className="mb-4 border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {paper.journal && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
              {paper.journal}
            </span>
          )}
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
            Published {paper.year}
          </span>
        </div>
        
        <h2 className="font-serif text-lg lg:text-xl text-slate-900 dark:text-slate-100 font-bold mb-1.5 tracking-tight leading-snug">
          {paper.title}
        </h2>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {paper.authors.join(", ")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("summary")}
          className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "summary"
              ? "border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen size={14} />
          Abstract Summary
        </button>
        <button
          onClick={() => setActiveTab("methodology")}
          className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "methodology"
              ? "border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Settings size={14} />
          Methodology
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "results"
              ? "border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Award size={14} />
          Results & Metrics
        </button>
        <button
          onClick={() => setActiveTab("limitations")}
          className={`py-1.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "limitations"
              ? "border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <AlertCircle size={14} />
          Limitations
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[120px] mb-6 text-slate-850 dark:text-slate-200 leading-relaxed text-xs lg:text-sm">
        {activeTab === "summary" && (
          <div className="space-y-2.5 animate-fade-in bg-slate-50 dark:bg-slate-950/30 p-3 rounded border border-slate-100 dark:border-slate-850">
            <h3 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Abstract Summary
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic pr-2">
              &ldquo;{paper.abstractSummary}&rdquo;
            </p>
          </div>
        )}

        {activeTab === "methodology" && (
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded border border-slate-100 dark:border-slate-850">
            <h3 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Methodology & Design
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {paper.methodologySummary}
            </p>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded border border-slate-100 dark:border-slate-850">
            <h3 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Results & Key Findings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {paper.resultsSummary}
            </p>
          </div>
        )}

        {activeTab === "limitations" && (
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded border border-slate-100 dark:border-slate-850">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Limitations & Fault Lines
            </h3>
            <ul className="space-y-2">
              {paper.limitations.map((lim, index) => (
                <li key={index} className="flex gap-2 items-start text-slate-700 dark:text-slate-300 text-xs">
                  <span className="inline-flex items-center justify-center min-w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-extrabold mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Citations Box */}
      <div className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-slate-800 rounded p-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
            <Quote size={13} className="text-indigo-600" />
            <span className="text-slate-500 dark:text-slate-450 tracking-wider">
              Citation Generator
            </span>
          </div>

          <div className="flex rounded bg-slate-200 dark:bg-slate-800 p-0.5" id="citation-switcher">
            {(["apa", "mla", "bibtex"] as const).map((format) => (
              <button
                key={format}
                onClick={() => setCitationFormat(format)}
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm font-semibold transition-all cursor-pointer ${
                  citationFormat === format
                    ? "bg-indigo-600 text-white shadow-3xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-slate-900 dark:bg-slate-950 text-slate-200 dark:text-slate-300 border dark:border-slate-850 rounded p-3 font-mono text-[11px] overflow-x-auto min-h-[46px] leading-relaxed">
          <p className="whitespace-pre-wrap pr-8">
            {citationFormat === "apa" && paper.citation.apa}
            {citationFormat === "mla" && paper.citation.mla}
            {citationFormat === "bibtex" && paper.citation.bibtex}
          </p>

          <button
            onClick={() => handleCopy(
              citationFormat === "apa" ? paper.citation.apa 
              : citationFormat === "mla" ? paper.citation.mla 
              : paper.citation.bibtex
            )}
            title="Copy citation"
            className="absolute top-2 right-2 bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 dark:hover:bg-slate-800 text-slate-300 p-1 rounded transition-all cursor-pointer"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}
