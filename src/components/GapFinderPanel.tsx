import React, { useState } from "react";
import { 
  CrossPaperAnalysis, 
  IdeationResult, 
  Paper 
} from "../types";
import { 
  AlertTriangle, 
  Lightbulb, 
  Compass, 
  Layers, 
  Terminal, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  BookMarked
} from "lucide-react";

interface Props {
  papers: Paper[];
  analysis: CrossPaperAnalysis;
  ideation: IdeationResult;
}

export default function GapFinderPanel({ papers, analysis, ideation }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getPaperName = (id: string) => {
    const found = papers.find((p) => p.id === id);
    return found ? found.title : id;
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="gap-finder-panel" className="space-y-4">
      
      {/* SECTION 1: CONTRADICTIONS & DEBATES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-amber-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Literature Contradictions & Dialectics
          </h3>
        </div>
        
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
          The following theoretical or methodological fault lines identify active debates in the research corpus. Understanding where papers clash highlights future avenues for validation.
        </p>

        {analysis.contradictions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {analysis.contradictions.map((contra, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-800 rounded p-3 bg-slate-50 dark:bg-slate-950/20 relative overflow-hidden text-xs">
                {/* VS Badge */}
                <div className="absolute right-0 top-0 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-bl">
                  Academic Fork
                </div>

                <div className="mb-3">
                  <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-450 bg-slate-200 dark:bg-slate-805 black dark:bg-slate-800 px-1.5 py-0.5 rounded mr-2">
                    Debate {index + 1}
                  </span>
                  <span className="font-serif text-xs font-bold text-slate-900 dark:text-slate-100">
                    {contra.topic}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                  {/* Perspective A */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
                        Perspective A
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed mb-2">
                        &ldquo;{contra.argumentA}&rdquo;
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                        📄 {getPaperName(contra.paperA)}
                      </span>
                    </div>
                  </div>

                  {/* Perspective B */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 block mb-1">
                        Perspective B
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed mb-2">
                        &ldquo;{contra.argumentB}&rdquo;
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                        📄 {getPaperName(contra.paperB)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 border border-slate-200 rounded">
            No contrasting paradigms or contradictions mapped in the active dataset.
          </p>
        )}
      </div>

      {/* SECTION 2: RESEARCH GAPS WITH PINK HIGHLIGHTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Compass size={16} className="text-pink-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Discovered Research Gaps
          </h3>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
          These elements have been identified as underserved, under-tested, or bottlenecked within the available reference publications. Uncovering these gaps presents high-quality paths to original research.
        </p>

        {analysis.gaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.gaps.map((gap, idx) => (
              <div key={idx} className="bg-pink-50/40 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/40 rounded p-3 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="inline-flex items-center justify-center min-w-5 h-5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 font-mono text-[10px] font-extrabold shadow-3xs">
                      G{idx + 1}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-pink-950 dark:text-pink-200 leading-tight">
                      {gap.gap}
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal mb-3 pl-7">
                    <strong className="text-pink-800 dark:text-pink-400 font-bold">scholarly Bottleneck / Impact:</strong> {gap.impact}
                  </p>
                </div>

                <div className="pl-7 pt-2 border-t border-pink-100 dark:border-pink-900/40">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-pink-800 dark:text-pink-400 block mb-1">
                    Research Opportunities
                  </span>
                  <ul className="space-y-1">
                    {gap.opportunities.map((opp, oppIdx) => (
                      <li key={oppIdx} className="text-[11px] text-slate-700 dark:text-slate-300 flex gap-2 items-start">
                        <span className="text-pink-500 leading-none mt-0.5">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 border border-slate-200 rounded">
            No research gaps evaluated. Add more diverse documents.
          </p>
        )}
      </div>

      {/* SECTION 3: THESIS PROPOSALS & PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Thesis proposals - span 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <BookMarked size={14} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              AI Thesis Outlines
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
            Highly structured research proposals addressing the identified literature gaps, featuring a hypotheses outline and recommended validation methods.
          </p>

          <div className="space-y-4">
            {ideation.thesisIdeas.map((idea, index) => {
              const uniqueId = `thesis_${index}`;
              const clipboardText = `Thesis Title: ${idea.title}\nHypothesis Statement: ${idea.statement}\nRationale: ${idea.rationale}\nMethodology Proposal: ${idea.methodologyProposal}`;
              
              return (
                <div key={index} className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded p-3.5 space-y-3 relative text-xs">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1.5 pr-12 leading-snug">
                      {idea.title}
                    </h4>
                    <button
                      onClick={() => handleCopy(uniqueId, clipboardText)}
                      className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-750 p-1 rounded transition-all cursor-pointer"
                      title="Copy proposal text"
                    >
                      {copiedId === uniqueId ? <Check size={12} className="text-green-650" /> : <Copy size={11} />}
                    </button>
                    
                    <span className="text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      Problem Hypothesis
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 italic leading-relaxed mt-0.5 ml-2.5 border-l-2 border-pink-300 dark:border-pink-805 pl-2.5">
                      &ldquo;{idea.statement}&rdquo;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        Theoretical Rationale
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal mt-0.5">
                        {idea.rationale}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                        Validation Method
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal mt-0.5">
                        {idea.methodologyProposal}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applied Project Ideas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} className="text-indigo-600" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Applied Prototypes
              </span>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
              Pragmatic coding architectures, tools, or diagnostic sandboxes to implement to test theories in practice.
            </p>

            <div className="space-y-3">
              {ideation.projectIdeas.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded p-3 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h5 className="font-serif text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {proj.title}
                      </h5>
                      <span className={`text-[8px] font-mono font-bold px-1.5 rounded shrink-0 ${
                        proj.difficulty === "Advanced" ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900" :
                        proj.difficulty === "Intermediate" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900" :
                        "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900"
                      }`}>
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-normal mb-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 leading-none">
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1 leading-none mt-1">
                      {proj.stackSuggestions.map((st) => (
                        <span key={st} className="text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1 py-0.5 rounded leading-none">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-550 font-medium">
              Ideas synced to active literature parameters
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: NOVEL HYBRID APPROACHES - SLATE-900 DARK COSMIC ASPECT */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-4 shadow-md relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute right-[-40px] bottom-[-40px] text-slate-800/60 pointer-events-none">
          <Sparkles size={200} />
        </div>

        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Sparkles size={16} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Novel Concept Synthesis
          </h3>
        </div>

        <p className="text-[11px] text-slate-450 leading-relaxed mb-4 max-w-4xl relative z-10">
          By algorithmically blending core architectures of separate papers in our repository, the system proposes these groundbreaking unified methodologies to bypass longstanding bottlenecks.
        </p>

        <div className="space-y-3 relative z-10">
          {ideation.novelApproaches.map((nh, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/10 pb-2">
                <h4 className="font-serif text-xs font-bold text-white tracking-tight">
                  {nh.title}
                </h4>
                <span className="text-[8px] font-mono bg-amber-400 text-slate-900 tracking-wider uppercase font-extrabold px-1.5 py-0.5 rounded">
                  Cross-Paper Synthesis
                </span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-normal">
                {nh.description}
              </p>

              <div className="pt-1.5">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Derivative Root Publication Seeds
                </span>
                <div className="flex flex-col gap-1">
                  {nh.parentPapers.map((pp, ppIdx) => (
                    <div key={ppIdx} className="text-xs text-amber-300 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0"></span>
                      <span className="truncate max-w-4xl text-[10px] text-slate-200 italic">
                        {pp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
