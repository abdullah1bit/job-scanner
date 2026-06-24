// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ScoreStatus = 'good' | 'needs_work' | 'critical';
export type ScoreBand = 'ats_ready' | 'minor_fixes' | 'major_fixes' | 'critical_issues';

export interface ScoreDimension {
  score: number;
  status: ScoreStatus;
  label: string;
  value: string;
  message: string;
  suggestion: string;
}

export interface AtsScore {
  overall: number;
  band: ScoreBand;
  wordCount: number;
  charCount: number;
  dimensions: {
    length: ScoreDimension;
    sections: ScoreDimension;
    actionVerbs: ScoreDimension;
    quantified: ScoreDimension;
    contact: ScoreDimension;
    dates: ScoreDimension;
    bulletDensity: ScoreDimension;
    atsRedFlags: ScoreDimension;
  };
  redFlags: string[];
  summary: string;
  topFixes: string[];
}

export interface ScoreOptions {
  targetRole?: string;
  language?: string;
}

// ---------------------------------------------------------------------------
// Match types
// ---------------------------------------------------------------------------

export type MatchBand = 'strong_match' | 'partial_match' | 'weak_match' | 'no_match';
export type KeywordCategory = 'skills' | 'experience' | 'domain' | 'other';
export type KeywordImportance = 'required' | 'preferred' | 'nice_to_have';

export interface MatchedKeyword {
  keyword: string;
  weight: number;
  category: KeywordCategory;
}

export interface MissingKeyword {
  keyword: string;
  weight: number;
  category: KeywordCategory;
  importance: KeywordImportance;
}

export interface MatchResult {
  score: number;
  band: MatchBand;
  totalKeywords: number;
  matchedKeywords: MatchedKeyword[];
  missingKeywords: MissingKeyword[];
  categories: {
    skills: { matched: number; missing: number };
    experience: { matched: number; missing: number };
    domain: { matched: number; missing: number };
  };
  topFixes: string[];
  summary: string;
}

export interface MatchOptions {
  targetRole?: string;
  language?: string;
  /** Pre-computed semantic concepts (e.g. from a prior AI call) */
  semanticConcepts?: string[];
  /**
   * Optional async hook for semantic concept extraction. If provided, the
   * library will call this with the job description and merge the result
   * with the deterministic keyword match. The hook is BYO-LLM — the
   * library does NOT call any LLM itself.
   *
   * Typical implementation: call your LLM provider with the JD, return
   * 5 most important concepts as a string array.
   *
   * @example
   * ```ts
   * matchResumeToJD(resume, jd, {
   *   aiConceptExtractor: async (jd) => {
   *     const res = await openai.chat.completions.create({...});
   *     return JSON.parse(res.choices[0].message.content);
   *   }
   * });
   * ```
   */
  aiConceptExtractor?: (jobDescription: string) => Promise<string[]>;
}

// ---------------------------------------------------------------------------
// Keyword extraction types
// ---------------------------------------------------------------------------

export interface Keyword {
  keyword: string;
  weight: number;
  category: KeywordCategory;
}

export interface KeywordOptions {
  maxKeywords?: number;
  language?: string;
}
