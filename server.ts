import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Lazily initialize standard Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Enable JSON and URL encoded payloads with 50mb limit (crucial for PDF uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve API Routes first
app.get("/api/status", (req, res) => {
  const isKeyConfigured = !!getGeminiClient();
  res.json({
    status: "ok",
    hasApiKey: isKeyConfigured,
    mode: isKeyConfigured ? "live" : "demo",
  });
});

// Endpoint 1: Individual Paper Analysis (PDF or Text)
app.post("/api/analyze-paper", async (req, res) => {
  try {
    const { fileName, fileType, textContent, pdfBase64 } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "fileName parameter is required" });
    }

    const client = getGeminiClient();

    // Standard high-quality fallback generator if Gemini is not configured
    if (!client) {
      console.log("Running in demo mode without Gemini API key. Generating high-quality synthesis.");
      
      // We will parse the file name or a snippet of text to make it customized
      const titleGuess = fileName
        .replace(/\.[^/.]+$/, "") // strip extension
        .split(/[_-]/)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const mockPaper = {
        id: "paper_" + Date.now().toString(36),
        title: titleGuess || "Untitled Deep Analysis",
        authors: ["S. Chen", "L. Robinson", "K. Takahashi"],
        year: new Date().getFullYear(),
        journal: "Global Journal of Research Synthesis & Deep Learning",
        abstractSummary: `This study presents an in-depth investigation based on '${fileName}'. It analyzes core data dynamics, introduces adaptive modeling structures, and targets the computational overhead historically associated with sequence handling or empirical validations. By utilizing specialized test vectors, it establishes a novel framework that bridges theoretical complexity and real-world deployment limitations.`,
        methodologySummary: `Utilizes a controlled double-blind sampling group across 1,200 unique testing iterations. Core processes were structured around a multi-stage sequential partition, employing high-frequency training checkpoints and applying statistical corrections (residual normalization) over variables to control standard deviation gaps. Evaluated on industry-standard benchmarking databases.`,
        resultsSummary: `The proposed architecture yielded a 14.5% improvement in processing latency and reduced high-bandwidth storage footprints by 32%. Compared to standard benchmark frameworks, it demonstrates superior robustness when handling outliers and scales lineally relative to input volume constraints.`,
        limitations: [
          "Requires custom runtime libraries which are not preloaded on legacy computing nodes.",
          "Exhibits a narrower margin of improvement on low-volume, single-core CPU environments.",
          "Lacks automated context-routing mechanisms, requiring static manual inputs for pre-partition boundaries."
        ],
        citation: {
          apa: `Chen, S., Robinson, L., & Takahashi, K. (${new Date().getFullYear()}). Structural adaptations and performance models for adaptive scaling. Global Journal of Research Synthesis, 14(3), 204-219.`,
          mla: `Chen, S., et al. "Structural adaptations and performance models for adaptive scaling." Global Journal of Research Synthesis, vol. 14, no. 3, ${new Date().getFullYear()}, pp. 204-219.`,
          bibtex: `@article{chen${new Date().getFullYear()}structural,
  title={Structural adaptations and performance models for adaptive scaling in ${titleGuess || "Research"}},
  author={Chen, S. and Robinson, L. and Takahashi, K.},
  journal={Global Journal of Research Synthesis},
  volume={14},
  number={3},
  pages={204--219},
  year={${new Date().getFullYear()}}
}`
        },
        topics: [
          "Optimization", 
          fileType === "pdf" ? "PDF Ingestion" : "Text Ingestion", 
          "Data Analysis"
        ],
        fileType: fileType || "text",
        fileName: fileName,
        textSnippet: textContent ? textContent.substring(0, 500) + "..." : "PDF file upload"
      };

      return res.json({ success: true, mode: "demo", paper: mockPaper });
    }

    // AI LIVE FLOW with Gemini
    console.log(`Analyzing file "${fileName}" (type: ${fileType}) using gemini-3.5-flash`);

    let geminiContentParts: any[] = [];
    let promptGuide = `You are a high-level research paper literature analyzer. Read the provided research paper material and extract its full detailed structure. Return a valid JSON object matching the defined response Schema exactly. Be objective, specific, and academic. Do not use markdown tags like \`\`\`json outside of your JSON response. Extract real citation facts, authors, journals, and abstract details if you find them.`;

    if (fileType === "pdf" && pdfBase64) {
      geminiContentParts.push({
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf"
        }
      });
      promptGuide += ` Please read this PDF document directly and analyze its layout, abstract, tables, and discussions.`;
    } else if (textContent) {
      geminiContentParts.push({
        text: `Paper Text Content:\n\n${textContent}`
      });
      promptGuide += ` Please read this raw paper text content and analyze its headers, citations, and summaries.`;
    } else {
      return res.status(400).json({ error: "Either textContent or pdfBase64 must be provided." });
    }

    geminiContentParts.push({ text: promptGuide });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContentParts,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Highly accurate research title from the paper." },
            authors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exact listing of authors' names." },
            year: { type: Type.INTEGER, description: "Four-digit publication year (e.g., 2024)." },
            journal: { type: Type.STRING, description: "Name of the journal, conference, or publication platform." },
            abstractSummary: { type: Type.STRING, description: "Detailed summary of the abstract and baseline motivations." },
            methodologySummary: { type: Type.STRING, description: "Clear detailed synthesis of the evaluation methods, algorithms, or experiments." },
            resultsSummary: { type: Type.STRING, description: "Exact results, metrics, benchmarks, and outcomes." },
            limitations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 distinct self-reported or critical limitations found in the paper." },
            citation: {
              type: Type.OBJECT,
              properties: {
                apa: { type: Type.STRING, description: "APA 7th citation string." },
                mla: { type: Type.STRING, description: "MLA 9th citation string." },
                bibtex: { type: Type.STRING, description: "Formatted BibTeX citation snippet." }
              },
              required: ["apa", "mla", "bibtex"]
            },
            topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 to 4 research topics suitable for clustering (e.g. Deep Learning, Climate, NLP)." }
          },
          required: ["title", "authors", "year", "abstractSummary", "methodologySummary", "resultsSummary", "limitations", "citation", "topics"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    // Add metadata
    const finalPaper = {
      id: "paper_" + Math.random().toString(36).substring(2, 9),
      ...parsedData,
      fileType,
      fileName,
      textSnippet: textContent ? textContent.substring(0, 500) + "..." : "PDF direct upload"
    };

    return res.json({ success: true, mode: "live", paper: finalPaper });
  } catch (err: any) {
    console.error("Gemini analysis error:", err);
    return res.status(500).json({ error: "Failed to analyze paper: " + err.message });
  }
});

// Endpoint 2: Cross-Paper Synthesis & Gap Finding
app.post("/api/synthesize-papers", async (req, res) => {
  try {
    const { papers } = req.body;

    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "An array of papers is required for synthesis." });
    }

    const client = getGeminiClient();

    if (!client) {
      console.log("No Gemini API key. Synthesizing papers via static helper patterns.");
      // We can generate synthetic combinations of user's uploaded papers
      const titles = papers.map(p => p.title);
      
      const syntheticAnalysis = {
        commonFindings: [
          {
            topic: "Cohesive Domain Convergence",
            description: `All reviewed documents (${papers.length} files) address modern performance benchmarks and highlight empirical adaptation strategies to validate theoretical progress.`,
            papers: papers.map(p => p.id)
          },
          {
            topic: "Systematic Constraints & Latency",
            description: "The papers heavily focus on latency bounds, performance overheads, or scaling limits associated with processing high volumes of source data.",
            papers: papers.slice(0, 2).map(p => p.id)
          }
        ],
        contradictions: [
          {
            topic: "Methodological Optimization Dichotomy",
            argumentA: `${papers[0]?.title || "First paper"} suggests prioritizing localized, specialized microarchitectural adjustments or narrow domain filtering.`,
            paperA: papers[0]?.id || "paper1",
            argumentB: `${papers[1]?.title || "Second paper"} advocates for generalizable, direct macro-scaling, claiming broader abstractions capture latent vectors more accurately.`,
            paperB: papers[1]?.id || "paper2"
          }
        ],
        trends: [
          { year: 2021, topic: "Exploratory modeling paradigms", weight: 6 },
          { year: 2023, topic: "Domain-specific vertical frameworks", weight: 8 },
          { year: 2026, topic: "Hybrid exact-approximate co-designed scaling", weight: 10 }
        ],
        gaps: [
          {
            gap: "Standardized Evaluation of Hybrid Context-Lengths",
            impact: "Most models scale fine conceptually but lack a rigorous testing protocol to determine if multi-modal contexts preserve accurate recall on long boundaries.",
            opportunities: [
              "Design structured synthetic key-value retrieval benchmarks.",
              "Construct multi-source legal cross-examination test suites."
            ]
          }
        ],
        thesisIdeas: [
          {
            title: `Unified Dynamic Routing models based on ${papers[0]?.title || "Recent Research"}`,
            statement: `How can the findings of ${papers[0]?.title || "the study"} be consolidated with the algorithmic bounds of ${papers[1]?.title || "subsequent trials"} to scale dynamic training schedules?`,
            rationale: "Aligning these two branches maximizes contextual indexing speeds without bottlenecking hardware components.",
            methodologyProposal: "Synthesize parameters into a multi-head route, simulate using Synthetic QA datasets, and measure validation perplexity limits."
          }
        ],
        projectIdeas: [
          {
            title: "Dynamic Scholar Gantry Map",
            description: "A lightweight dynamic indexer that maps paper citations and displays live divergence metrics on a visual canvas.",
            stackSuggestions: ["React", "TailwindCSS", "Node.js"],
            difficulty: "Intermediate"
          }
        ],
        novelApproaches: [
          {
            title: "Co-fused Adaptive Parameters (CAP)",
            description: `A hybrid conceptual structure integrating the localized data-tiling ideas from "${papers[1]?.title || "Paper B"}" into the macro-logical pipeline of "${papers[0]?.title || "Paper A"}". The resulting model improves data throughput by up to 2.5x under severe GPU memory bottlenecks.`,
            parentPapers: papers.map(p => p.title)
          }
        ]
      };

      return res.json({ success: true, mode: "demo", analysis: syntheticAnalysis, ideation: syntheticAnalysis });
    }

    console.log(`Synthesizing ${papers.length} papers using Gemini API...`);

    const paperSummaries = papers.map(p => `
ID: ${p.id}
Title: ${p.title}
Authors: ${p.authors.join(", ")}
Year: ${p.year}
Abstract: ${p.abstractSummary}
Methodology: ${p.methodologySummary}
Results: ${p.resultsSummary}
Limitations: ${p.limitations.join("; ")}
Topics: ${p.topics.join(", ")}
    `).join("\n\n---\n\n");

    const prompt = `You are a world-class system academic synthesizer. I will give you a list of research papers with their summaries. 
Your job is to carry out deep cross-paper analysis and generate innovative thesis and project ideations.

Here is the list of research papers:
${paperSummaries}

Provide your analysis in JSON format matching the schema rules exactly. You must identify specific connections, contradictions, and research trends between these actual papers. For 'papers' fields, use their exact IDs from the list. Combine your cross-paper findings and your AI ideation module recommendations (thesis ideas, project ideas, novel approaches) into a single unified JSON output structure.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonFindings: {
              type: Type.ARRAY,
              description: "Extracted mutual results or concurrent paradigms where papers agree.",
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING, description: "Headline of the mutual finding." },
                  description: { type: Type.STRING, description: "Why these papers agree and what core concept they validate." },
                  papers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "IDs of the agreeing papers." }
                },
                required: ["topic", "description", "papers"]
              }
            },
            contradictions: {
              type: Type.ARRAY,
              description: "Debates, alternative theories, or opposing result statements between papers.",
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING, description: "Theme of the argument or dichotomy." },
                  argumentA: { type: Type.STRING, description: "Claim or evidence from Paper A." },
                  paperA: { type: Type.STRING, description: "ID of Paper A." },
                  argumentB: { type: Type.STRING, description: "Opposing claim or counter-evidence from Paper B." },
                  paperB: { type: Type.STRING, description: "ID of Paper B." }
                },
                required: ["topic", "argumentA", "paperA", "argumentB", "paperB"]
              }
            },
            trends: {
              type: Type.ARRAY,
              description: "Chronological or logical projection of topics shifting years (including weight 1-10 of intensiveness).",
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.INTEGER, description: "Estimated peak year or actual year." },
                  topic: { type: Type.STRING, description: "Research focus topic name." },
                  weight: { type: Type.INTEGER, description: "Trend intensity (1-10)." }
                },
                required: ["year", "topic", "weight"]
              }
            },
            gaps: {
              type: Type.ARRAY,
              description: "Critically missing links, underevaluated topics, or bottlenecks unaddressed by current research.",
              items: {
                type: Type.OBJECT,
                properties: {
                  gap: { type: Type.STRING, description: "Brief description of the research gap." },
                  impact: { type: Type.STRING, description: "Negative impact/consequences of leaving this gap unaddressed." },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Future investigation opportunities." }
                },
                required: ["gap", "impact", "opportunities"]
              }
            },
            thesisIdeas: {
              type: Type.ARRAY,
              description: "Fully-developed original thesis topics.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Elegant, academic thesis proposal title." },
                  statement: { type: Type.STRING, description: "Core question or hypothesis." },
                  rationale: { type: Type.STRING, description: "Theoretical backing as to why this solves a research gap." },
                  methodologyProposal: { type: Type.STRING, description: "Experimental design to prove or disprove the hypothesis." }
                },
                required: ["title", "statement", "rationale", "methodologyProposal"]
              }
            },
            projectIdeas: {
              type: Type.ARRAY,
              description: "Pragmatic developer tools, benchmarks, or software layouts.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Applied software or coding project title." },
                  description: { type: Type.STRING, description: "What the software tool does and who it helps." },
                  stackSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested technology components." },
                  difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] }
                },
                required: ["title", "description", "stackSuggestions", "difficulty"]
              }
            },
            novelApproaches: {
              type: Type.ARRAY,
              description: "Creative architectural/methodological syntheses combining concepts directly from the papers.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Name of the novel hybrid technique." },
                  description: { type: Type.STRING, description: "How combining elements of Paper A and Paper B solves an open bottleneck." },
                  parentPapers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Titles or IDs of the parent papers representing the root seeds." }
                },
                required: ["title", "description", "parentPapers"]
              }
            }
          },
          required: ["commonFindings", "contradictions", "trends", "gaps", "thesisIdeas", "projectIdeas", "novelApproaches"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      mode: "live",
      analysis: {
        commonFindings: parsedData.commonFindings,
        contradictions: parsedData.contradictions,
        trends: parsedData.trends,
        gaps: parsedData.gaps
      },
      ideation: {
        thesisIdeas: parsedData.thesisIdeas,
        projectIdeas: parsedData.projectIdeas,
        novelApproaches: parsedData.novelApproaches
      }
    });
  } catch (err: any) {
    console.error("Gemini synthesis error:", err);
    return res.status(500).json({ error: "Failed to synthesize papers: " + err.message });
  }
});

// Endpoint 3: Literature Review Generator
app.post("/api/generate-literature-review", async (req, res) => {
  try {
    const { papers, focus } = req.body;

    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "An array of papers is required for drafting a literature review." });
    }
    if (!focus) {
      return res.status(400).json({ error: "Focus theme is required." });
    }

    const client = getGeminiClient();

    if (!client) {
      console.log("No Gemini API key. Generating sample literature review statically.");
      
      const introduction = `This literature review synthesizes research papers regarding "${focus}", looking closely at the findings, methodologies, and limitations of ${papers.length} selected studies. The critical integration of these texts highlights key progress and open areas in the domain.`;
      
      const bodySections = papers.map((p, idx) => ({
        title: `Perspective ${idx + 1}: ${p.title}`,
        content: `According to ${p.authors[0] || "Researchers"} et al. (${p.year}), addressing these themes requires structuring evaluations carefully. Their work utilized an elegant methodology focused around ${p.methodologySummary.toLowerCase()} which highlighted that ${p.resultsSummary.toLowerCase()} However, a notable limitation remains: ${p.limitations[0] || "the empirical constraints in real-world scenarios."}`
      }));

      const conclusion = `In conclusion, synthesizing these texts demonstrates that while progress regarding "${focus}" is active, substantial gaps regarding hardware constraints, scaling indices, and model approximation bounds remain. Hybrid frameworks represent a key pathway forward.`;

      const references = papers.map(p => p.citation.apa);

      return res.json({
        success: true,
        mode: "demo",
        review: {
          focus,
          introduction,
          bodySections,
          conclusion,
          references
        }
      });
    }

    console.log(`Generating literature review for focus "${focus}" using Gemini...`);

    const paperSummaries = papers.map(p => `
Title: ${p.title}
Authors: ${p.authors.join(", ")}
Year: ${p.year}
Abstract: ${p.abstractSummary}
Methodology: ${p.methodologySummary}
Results: ${p.resultsSummary}
APA Citation: ${p.citation.apa}
    `).join("\n\n---\n\n");

    const prompt = `You are an elite academic writer. Draft a beautifully phrased, comprehensive Literature Review based on the following papers and the user's specific Research Focus.

Research Focus Selected: "${focus}"

Papers available for synthesis:
${paperSummaries}

Provide your draft in JSON format matching the schema rules exactly. Make sure to use academic language, cite the papers naturally in the text (e.g. "Vaswani et al., 2017"), and create deep, paragraph-long content sections. Do not use raw markdown tags like \`\`\`json outside of your JSON response.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING, description: "High-quality introductory paragraph outlining the overall context and scope of the focus." },
            bodySections: {
              type: Type.ARRAY,
              description: "2-3 deep body paragraphs, structured sequentially with titles.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Thematic heading of this specific review section." },
                  content: { type: Type.STRING, description: "Detailed synthesis, comparison of methodologies, and in-text citations." }
                },
                required: ["title", "content"]
              }
            },
            conclusion: { type: Type.STRING, description: "Concluding paragraph summarizing mutual agreements, remaining bottlenecks, and prospective work." },
            references: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Valid citations of the papers referenced in standard APA format." }
          },
          required: ["introduction", "bodySections", "conclusion", "references"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      mode: "live",
      review: {
        focus,
        ...parsedData
      }
    });
  } catch (err: any) {
    console.error("Gemini Literature Review error:", err);
    return res.status(500).json({ error: "Failed to generate literature review: " + err.message });
  }
});


// Set up Vite development server middleware OR serve static build assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Single page app fallback: serve index.html for any unhandled routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Research Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
