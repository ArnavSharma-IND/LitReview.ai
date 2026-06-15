import React, { useState, useMemo } from "react";
import { Paper, ResearchTrend } from "../types";
import { 
  TrendingUp, 
  Layers, 
  Hash, 
  MapPin, 
  Calendar, 
  Sparkles, 
  BookOpen 
} from "lucide-react";

interface Props {
  papers: Paper[];
  trends: ResearchTrend[];
}

export default function TrendAnalysisChart({ papers, trends }: Props) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  // Derive Topic Clusters from papers
  const topicClusters = useMemo(() => {
    const clusters: Record<string, Paper[]> = {};
    papers.forEach((p) => {
      p.topics.forEach((t) => {
        if (!clusters[t]) {
          clusters[t] = [];
        }
        clusters[t].push(p);
      });
    });
    return clusters;
  }, [papers]);

  // Set default selected cluster
  const clustersList = Object.keys(topicClusters);
  const activeCluster = selectedCluster || clustersList[0] || "";

  return (
    <div id="trend-analysis" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Topic Clustering Workshop */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers size={16} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Cognitive Topic Clusters
              </h3>
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 leading-normal">
              Click any cluster folder to isolate and explore grouped literature associations in the dataset.
            </p>

            {/* Clusters pill tray */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {clustersList.map((topic) => {
                const isActive = activeCluster === topic;
                const papersCount = topicClusters[topic].length;
                return (
                  <button
                    key={topic}
                    onClick={() => setSelectedCluster(topic)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-3xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
                    }`}
                  >
                    <Hash size={11} className={isActive ? "opacity-90" : "text-slate-400 dark:text-slate-500"} />
                    {topic}
                    <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    }`}>
                      {papersCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Cluster Paper Cards */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded p-3 min-h-[160px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Associated Documents ({topicClusters[activeCluster]?.length || 0})
            </span>
            
            {activeCluster && topicClusters[activeCluster] ? (
              topicClusters[activeCluster].map((paper) => (
                <div 
                  key={paper.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded p-2 text-slate-800 dark:text-slate-300 shadow-3xs hover:border-slate-350 dark:hover:border-slate-700 transition-all text-xs"
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {paper.title}
                    </h4>
                    <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.5 rounded shrink-0">
                      {paper.year}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mb-1">
                    {paper.authors.slice(0, 3).join(", ")} {paper.authors.length > 3 ? "et al." : ""}
                  </p>
                  <div className="flex gap-1 overflow-x-auto select-none">
                    {paper.topics.map((t) => (
                      <span key={t} className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center pt-8">
                No active focus clusters isolated.
              </p>
            )}
          </div>
        </div>

        {/* Chronological Research Trends */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Evolutionary Timeline & Trends
            </h3>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 leading-normal">
            Dynamic timeline tracking specific domain shifts and technical paradigm weight peaks over time.
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {trends.length > 0 ? (
              // Sort trends by year descending
              [...trends]
                .sort((a, b) => b.year - a.year)
                .map((tr, index) => (
                  <div key={tr.topic + tr.year} className="relative pl-5 pb-1 border-l border-slate-200 dark:border-slate-800 last:border-transparent">
                    {/* Timeline dot */}
                    <span className="absolute left-[-4.5px] top-1.5 w-2 flex h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950/40 z-10"></span>
                    
                    <div className="flex items-center justify-between gap-4 mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {tr.year}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {tr.topic}
                        </h4>
                      </div>
                      
                      <span className="text-[9px] font-mono font-medium rounded px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950/60 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-800/80">
                        {tr.weight}/10 intensity
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${tr.weight * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center pt-12">
                Analyze loaded study papers to plot current trends.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
