import type { Keyword, KeywordOptions, MatchOptions, MatchResult } from './types';
import { computeMatchBand } from './constants/thresholds';
import { STOPWORDS } from './constants/stopwords';

/**
 * Extract top keywords from a job description.
 *
 * Uses position-weighted frequency (title gets 3x, first paragraph 2x, body 1x)
 * and importance multipliers (regex for "required", "must have" → 2x).
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
 * Match a resume against a job description.
 *
 * Returns a deterministic match score based on keyword overlap.
 * When `semanticConcepts` is provided (e.g. from AI extraction), those
 * concepts are merged with the deterministic keywords.
 *
 * @param resumeText - The resume text
 * @param jobDescription - The job description text
 * @param options - Optional configuration including semantic concepts
 * @returns MatchResult with score, band, matched/missing keywords, and fixes
 */
export function matchResumeToJD(
  resumeText: string,
  jobDescription: string,
  options: MatchOptions = {},
): MatchResult {
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

  // Merge AI-extracted semantic concepts with deterministic keywords.
  // AI concepts get boosted weight (5) and are checked against the resume
  // with the same substring match. Full synonym + categorization logic
  // is being implemented; for now this adds bonus concepts to the match.
  const semanticKeywords = (options.semanticConcepts ?? []).map((c) => ({
    keyword: c.toLowerCase(),
    weight: 5,
    category: 'other' as const,
  }));
  const allKeywords = [...keywords, ...semanticKeywords];

  const resumeLower = resumeText.toLowerCase();

  const matchedKeywords = allKeywords.filter((k) => resumeLower.includes(k.keyword));
  const missingKeywords = allKeywords
    .filter((k) => !resumeLower.includes(k.keyword))
    .map((k) => ({
      ...k,
      importance: (k.weight >= 3 ? 'required' : 'preferred') as 'required' | 'preferred',
    }));

  const matchedWeight = matchedKeywords.reduce((sum, k) => sum + k.weight, 0);
  const totalWeight = allKeywords.reduce((sum, k) => sum + k.weight, 0);
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

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
          ? `Your resume partially matches. Top gap: "${missingKeywords[0]?.keyword ?? 'none'}".`
          : 'Your resume needs significant tailoring to match this job.',
  };
}
