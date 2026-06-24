import type { Keyword, KeywordOptions, MatchOptions, MatchResult } from './types';
import { computeMatchBand } from './constants/thresholds';
import { STOPWORDS } from './constants/stopwords';

/**
 * Extract top keywords from a job description.
 *
 * Uses position-weighted frequency (title gets 3x, first paragraph 2x, body 1x).
 * Stopwords are filtered out. Returns top N keywords by weight.
 *
 * @param text - The job description text
 * @param options - Optional max keywords and language
 * @returns Top N keywords with weights and categories
 */
export function extractKeywords(text: string, options: KeywordOptions = {}): Keyword[] {
  if (typeof text !== 'string') {
    throw new Error('Job description text must be a string');
  }
  const max = options.maxKeywords ?? 20;
  const language = options.language ?? 'en';
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const titleLine = lines[0] || '';
  const firstParagraph = lines.slice(0, 3).join(' ');
  const body = lines.slice(3).join(' ');

  const tokens = text.split(/\W+/).filter(Boolean);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (STOPWORDS.has(lower) || lower.length <= 2) continue;
    const inTitle = titleLine.toLowerCase().includes(lower) ? 3 : 0;
    const inFirstPara = firstParagraph.toLowerCase().includes(lower) ? 2 : 0;
    const inBody = body.toLowerCase().includes(lower) ? 1 : 0;
    const weight = inTitle + inFirstPara + inBody;
    if (weight === 0) continue;
    counts.set(lower, (counts.get(lower) || 0) + weight);
  }

  // 'language' parameter reserved for future per-language stopword support
  void language;

  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, max)
    .map(([keyword, weight]) => ({ keyword, weight, category: 'other' }));
}

/**
 * Match a resume against a job description, returning a match score and
 * missing keywords.
 *
 * **Deterministic by default.** The library itself does NOT call any LLM.
 * To add semantic understanding, pass an `aiConceptExtractor` callback in
 * `options` (or pre-compute `semanticConcepts`). The callback is BYO — the
 * library never sees your API key.
 *
 * @param resumeText - The resume text
 * @param jobDescription - The job description text
 * @param options - Optional configuration including AI concept extractor
 * @returns Promise<MatchResult> with score, band, matched/missing keywords, fixes
 *
 * @example Basic (deterministic only)
 * ```ts
 * import { matchResumeToJD } from '@resumepolish/ats-scorer';
 * const result = await matchResumeToJD(resumeText, jd);
 * console.log(result.score); // 45
 * ```
 *
 * @example With semantic AI extraction (BYO LLM)
 * ```ts
 * const result = await matchResumeToJD(resumeText, jd, {
 *   aiConceptExtractor: async (jd) => {
 *     const res = await openai.chat.completions.create({
 *       model: 'gpt-4o-mini',
 *       messages: [{ role: 'user', content: `Extract 5 key concepts from: ${jd}` }],
 *     });
 *     return JSON.parse(res.choices[0].message.content);
 *   }
 * });
 * ```
 *
 * @example With pre-computed concepts (recommended for production)
 * ```ts
 * const concepts = await callMyLLM(jd);
 * const result = await matchResumeToJD(resumeText, jd, {
 *   semanticConcepts: concepts,
 * });
 * ```
 */
export async function matchResumeToJD(
  resumeText: string,
  jobDescription: string,
  options: MatchOptions = {},
): Promise<MatchResult> {
  if (typeof resumeText !== 'string' || typeof jobDescription !== 'string') {
    throw new Error('Both resume and JD must be strings');
  }
  if (jobDescription.trim().length === 0) {
    return {
      score: 0,
      band: 'no_match',
      totalKeywords: 0,
      matchedKeywords: [],
      missingKeywords: [],
      categories: {
        skills: { matched: 0, missing: 0 },
        experience: { matched: 0, missing: 0 },
        domain: { matched: 0, missing: 0 },
      },
      topFixes: [],
      summary: 'No job description provided.',
    };
  }

  const keywords = extractKeywords(jobDescription, { maxKeywords: 20 });

  // Resolve semantic concepts from either pre-computed value or the
  // BYO-LLM hook. If both are provided, pre-computed wins (it's a cache hit).
  let semanticConcepts: string[] = options.semanticConcepts ?? [];
  if (semanticConcepts.length === 0 && options.aiConceptExtractor) {
    try {
      semanticConcepts = await options.aiConceptExtractor(jobDescription);
    } catch {
      // AI extraction failed — fall back to deterministic only
      semanticConcepts = [];
    }
  }

  const semanticKeywords = semanticConcepts.map((c) => ({
    keyword: c.toLowerCase().trim(),
    weight: 5,
    category: 'other' as const,
  }));
  const allKeywords = [...keywords, ...semanticKeywords];

  const resumeLower = resumeText.toLowerCase();

  const matchedKeywords = allKeywords.filter((k) =>
    resumeLower.includes(k.keyword.toLowerCase()),
  );
  const missingKeywords = allKeywords
    .filter((k) => !resumeLower.includes(k.keyword.toLowerCase()))
    .map((k) => ({
      ...k,
      importance: (k.weight >= 3 ? 'required' : 'preferred') as 'required' | 'preferred',
    }));

  const matchedWeight = matchedKeywords.reduce((sum, k) => sum + k.weight, 0);
  const totalWeight = allKeywords.reduce((sum, k) => sum + k.weight, 0);
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  const topGap = missingKeywords[0]?.keyword ?? 'none';
  return {
    score,
    band: computeMatchBand(score),
    totalKeywords: allKeywords.length,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 8),
    categories: {
      skills: { matched: 0, missing: 0 },
      experience: { matched: 0, missing: 0 },
      domain: { matched: 0, missing: 0 },
    },
    topFixes: [],
    summary:
      score >= 70
        ? 'Your resume covers the key requirements well.'
        : score >= 40
          ? `Your resume partially matches. Top gap: "${topGap}".`
          : 'Your resume needs significant tailoring to match this job.',
  };
}
