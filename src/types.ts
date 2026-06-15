export interface Citation {
  apa: string;
  mla: string;
  bibtex: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  abstractSummary: string;
  methodologySummary: string;
  resultsSummary: string;
  limitations: string[];
  citation: Citation;
  topics: string[];
  fileType: "pdf" | "text" | "sample";
  fileName: string;
  textSnippet?: string;
}

export interface CommonFinding {
  topic: string;
  description: string;
  papers: string[]; // Paper IDs or Titles
}

export interface Contradiction {
  topic: string;
  argumentA: string;
  paperA: string; // Paper title or ID
  argumentB: string;
  paperB: string; // Paper title or ID
}

export interface ResearchTrend {
  year: number;
  topic: string;
  weight: number; // 1 to 10 representation of trend intensity
}

export interface ResearchGap {
  gap: string;
  impact: string;
  opportunities: string[];
}

export interface CrossPaperAnalysis {
  commonFindings: CommonFinding[];
  contradictions: Contradiction[];
  trends: ResearchTrend[];
  gaps: ResearchGap[];
}

export interface ThesisIdea {
  title: string;
  statement: string;
  rationale: string;
  methodologyProposal: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  stackSuggestions: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface NovelApproach {
  title: string;
  description: string;
  parentPapers: string[];
}

export interface IdeationResult {
  thesisIdeas: ThesisIdea[];
  projectIdeas: ProjectIdea[];
  novelApproaches: NovelApproach[];
}

export interface LitReviewSection {
  title: string;
  content: string;
}

export interface LiteratureReview {
  focus: string;
  introduction: string;
  bodySections: LitReviewSection[];
  conclusion: string;
  references: string[];
}
