import React, { useState } from "react";
import { LiteratureReview, Paper } from "../types";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Loader2, 
  RefreshCw 
} from "lucide-react";

interface Props {
  papers: Paper[];
  activeReview: LiteratureReview;
  onGenerate: (focus: string) => Promise<void>;
}

export default function LiteratureReviewGenerator({ papers, activeReview, onGenerate }: Props) {
  const [focusInput, setFocusInput] = useState(activeReview.focus);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!focusInput.trim()) return;
    
    setGenerating(true);
    try {
      await onGenerate(focusInput.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyClipboard = () => {
    const formattedText = `
LITERATURE REVIEW DRAFT
Focus Theme: ${activeReview.focus}

INTRODUCTION
${activeReview.introduction}

${activeReview.bodySections.map(b => `${b.title.toUpperCase()}\n${b.content}`).join("\n\n")}

CONCLUSION
${activeReview.conclusion}

REFERENCES
${activeReview.references.map((r, i) => `[${i + 1}] ${r}`).join("\n")}
    `;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download draft as a .md file
  const handleDownloadMarkdown = () => {
    const mdContent = `# Literature Review: ${activeReview.focus}

## Introduction
${activeReview.introduction}

${activeReview.bodySections.map(b => `## ${b.title}\n\n${b.content}`).join("\n\n")}

## Conclusion
${activeReview.conclusion}

## References
${activeReview.references.map(r => `- ${r}`).join("\n")}
    `;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Literature_Review_${activeReview.focus.replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(activeReview, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Literature_Review_${activeReview.focus.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="literature-review-generator" className="space-y-4">
      
      {/* Search Focus Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Synthesis Topic Controller
          </h3>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3.5 leading-normal">
          Type or modify the research focus theme below. The RAG system will construct a cohesive draft automatically incorporating all selected publications.
        </p>

        <form onSubmit={handleGenerateClick} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={focusInput}
            onChange={(e) => setFocusInput(e.target.value)}
            placeholder="e.g., Sequence Complexity bottlenecks and exact SRAM-Tiling optimization..."
            disabled={generating}
            className="flex-1 rounded border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all placeholder-slate-400 dark:placeholder-slate-550"
          />
          
          <button
            type="submit"
            disabled={generating || !focusInput.trim()}
            className="rounded bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-amber-300" />
                <span>Draft Theme Review</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Literature Draft display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-3xs overflow-hidden">
        {/* Parchment Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[9px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Scholar Synthesis MS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyClipboard}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Copy review to clipboard"
            >
              {copied ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
              <span>Copy Text</span>
            </button>
            
            <button
              onClick={handleDownloadMarkdown}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Download formatted Markdown file"
            >
              <Download size={11} />
              <span>Markdown</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Download JSON layout"
            >
              <Download size={11} />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Real manuscript layout */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-xs md:text-sm selection:bg-pink-100 dark:selection:bg-pink-950/40">
          
          {/* Header */}
          <div className="text-center font-serif border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-700 dark:text-indigo-400 uppercase block mb-1">
              Literature Review Generation Sheet
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              {activeReview.focus}
            </h2>
            <div className="flex justify-center items-center gap-2 mt-2 text-[10px] font-sans text-slate-400 dark:text-slate-500 font-medium">
              <span>Synthesizing: Reference Publications ({papers.length})</span>
            </div>
          </div>

          {/* Intro Section */}
          <div className="space-y-2">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              1. Introduction & Context
            </h4>
            <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-indigo-700 dark:first-letter:text-indigo-400 first-letter:float-left first-letter:mr-2 first-letter:font-serif leading-relaxed text-slate-700 dark:text-slate-300">
              {activeReview.introduction}
            </p>
          </div>

          {/* Body Sections */}
          {activeReview.bodySections.map((sect, index) => (
            <div key={index} className="space-y-2 pt-2">
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                2.{index + 1} {sect.title}
              </h4>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {sect.content}
              </p>
            </div>
          ))}

          {/* Conclusion */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              3. Conclusion & Scope Summary
            </h4>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300 italic">
              {activeReview.conclusion}
            </p>
          </div>

          {/* References */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Formal References (APA 7th)
            </h4>
            <div className="space-y-1.5 font-sans text-[10px] text-slate-500 dark:text-slate-450 pl-3 border-l border-slate-200 dark:border-slate-800">
              {activeReview.references.map((refStr, idx) => (
                <p key={idx} className="indent-[-12px] pl-3 leading-normal">
                  {refStr}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
