import React, { useState, useRef } from "react";
import { 
  X, 
  Upload, 
  FileText, 
  Type, 
  Briefcase, 
  AlertCircle,
  Loader2
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onIngest: (fileName: string, fileType: "pdf" | "text", content: { textContent?: string; pdfBase64?: string }) => Promise<void>;
}

export default function AddPaperModal({ isOpen, onClose, onIngest }: Props) {
  const [activeMode, setActiveMode] = useState<"upload" | "paste">("upload");
  const [fileName, setFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [pdfBase64, setPdfBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tickerMessage, setTickerMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Convert uploaded PDF or text file
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setError("");
    setFileName(file.name);

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const resultString = reader.result as string;
        // Slice out the header "data:application/pdf;base64,"
        const base64Data = resultString.split(",")[1];
        setPdfBase64(base64Data);
        setTextContent("");
      };
      reader.onerror = () => setError("Failed to parse file.");
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        setTextContent(reader.result as string);
        setPdfBase64("");
      };
      reader.onerror = () => setError("Failed to parse file.");
      reader.readAsText(file);
    } else {
      setError("Unsupported file format. Please drop a PDF (.pdf) or plain text (.txt) document.");
      setFileName("");
    }
  };

  const runTickers = () => {
    const tickers = [
      "Securing analytical endpoints...",
      "Reading file structure...",
      "Extracting publication metadata...",
      "Parsing core abstract boundaries...",
      "Analyzing experiment methods...",
      "Running semantic validation schemas...",
      "Structuring unified RAG parameters..."
    ];
    let idx = 0;
    setTickerMessage(tickers[0]);
    const interval = setInterval(() => {
      idx++;
      if (idx < tickers.length) {
        setTickerMessage(tickers[idx]);
      } else {
        clearInterval(interval);
      }
    }, 2500);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === "upload" && !fileName) {
      setError("Please drop or browse an academic document first.");
      return;
    }
    if (activeMode === "paste" && (!fileName || !textContent)) {
      setError("Please define both title name and text body content.");
      return;
    }

    setSubmitting(true);
    const tickerInterval = runTickers();

    try {
      const fileType = activeMode === "upload" && pdfBase64 ? "pdf" : "text";
      await onIngest(fileName, fileType, {
        textContent: textContent || undefined,
        pdfBase64: pdfBase64 || undefined
      });
      // Reset state
      setFileName("");
      setTextContent("");
      setPdfBase64("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to analyze research paper.");
    } finally {
      clearInterval(tickerInterval);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="file-ingest-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div 
        id="file-ingest-modal" 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col transition-all max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload size={14} className="text-indigo-650" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              Ingest Research Publication
            </h3>
          </div>
          <button 
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-105 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-450 border border-red-200 dark:border-red-900/60 px-3 py-2 rounded text-xs flex gap-2 items-start animate-fade-in">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode switch */}
          {!submitting && (
            <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded w-full mb-1">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("upload");
                  setError("");
                }}
                className={`flex-1 py-1 px-2.5 rounded-sm text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === "upload"
                    ? "bg-indigo-600 text-white shadow-3xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <FileText size={12} />
                File Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("paste");
                  setError("");
                }}
                className={`flex-1 py-1 px-2.5 rounded-sm text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === "paste"
                    ? "bg-indigo-600 text-white shadow-3xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Type size={12} />
                Paste Snippet
              </button>
            </div>
          )}

          {submitting ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3 animate-pulse">
              <Loader2 size={32} className="text-indigo-650 animate-spin" />
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Running Literature Model
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
                  {tickerMessage}
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeMode === "upload" ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-250 dark:border-slate-700 hover:border-indigo-500 rounded-lg p-6 bg-slate-50 dark:bg-slate-950/20 text-center transition-all group hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload size={28} className="text-slate-400 dark:text-slate-500 mx-auto mb-2 group-hover:text-indigo-600 transition-all" />
                  
                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px] mx-auto">
                        Inbound: {fileName}
                      </p>
                      <p className="text-[9px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Buffered successfully — Ready to Ingest
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Drop publication, or <span className="text-indigo-600 underline">browse computer</span>
                      </p>
                      <p className="text-[9.5px] text-slate-450 dark:text-slate-500 font-mono mt-1 uppercase">
                        Supports PDF (.pdf) or text (.txt)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3.5 animate-fade-in text-slate-800 dark:text-slate-200 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Research Publication Title
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g., Attention Bottlenecking and Scale Constraints..."
                      className="w-full rounded border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Literature Body Text Snippet
                    </label>
                    <textarea
                      rows={5}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Paste abstract, results, methodology details or core summaries here..."
                      className="w-full rounded border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all font-sans"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Ingestion Footer actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Ingest Paper
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  );
}
