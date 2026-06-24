import type { AtsScore, ScoreBand } from '../types';

/**
 * Weighted importance of each dimension in the overall score.
 * Must sum to 1.0.
 *
 * Quantified achievements get the highest weight because they're the
 * single best predictor of resume impact.
 */
export const SCORE_WEIGHTS = {
  length: 0.10,
  sections: 0.15,
  actionVerbs: 0.15,
  quantified: 0.20,
  contact: 0.10,
  dates: 0.05,
  bulletDensity: 0.10,
  atsRedFlags: 0.15,
} as const;

export const WEIGHT_SUM = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);

if (Math.abs(WEIGHT_SUM - 1.0) > 0.001) {
  throw new Error(`SCORE_WEIGHTS must sum to 1.0, got ${WEIGHT_SUM}`);
}

/**
 * Map a 0-100 overall score to a band label.
 */
export function computeBand(overall: number): ScoreBand {
  if (overall >= 85) return 'ats_ready';
  if (overall >= 70) return 'minor_fixes';
  if (overall >= 50) return 'major_fixes';
  return 'critical_issues';
}

/**
 * Compute the weighted overall score from individual dimension scores.
 */
export function computeOverall(dimensions: AtsScore['dimensions']): number {
  const total = Object.entries(SCORE_WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + dimensions[key as keyof typeof dimensions].score * weight;
  }, 0);
  return Math.round(total);
}

/**
 * Match-score bands (separate from ATS score bands).
 */
export const MATCH_BAND_THRESHOLDS = {
  strong_match: 70,
  partial_match: 40,
  weak_match: 20,
} as const;

/**
 * Map a 0-100 match score to a band label.
 */
export function computeMatchBand(score: number): 'strong_match' | 'partial_match' | 'weak_match' | 'no_match' {
  if (score >= MATCH_BAND_THRESHOLDS.strong_match) return 'strong_match';
  if (score >= MATCH_BAND_THRESHOLDS.partial_match) return 'partial_match';
  if (score >= MATCH_BAND_THRESHOLDS.weak_match) return 'weak_match';
  return 'no_match';
}
