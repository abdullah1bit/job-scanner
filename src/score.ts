import type { AtsScore, ScoreOptions } from './types';
import { scoreLength } from './dimensions/length';
import { scoreSections } from './dimensions/sections';
import { scoreActionVerbs } from './dimensions/action-verbs';
import { scoreQuantified } from './dimensions/quantified';
import { scoreContact } from './dimensions/contact';
import { scoreDates } from './dimensions/dates';
import { scoreBulletDensity } from './dimensions/bullet-density';
import { scoreAtsRedFlags } from './dimensions/ats-red-flags';
import { computeBand, computeOverall } from './constants/thresholds';

/**
 * Score a resume against the 8 deterministic ATS dimensions.
 *
 * @param text - The resume text to score (50-20000 chars recommended)
 * @param options - Optional configuration (targetRole, language)
 * @returns A complete AtsScore object with overall score, band, and per-dimension breakdown
 *
 * @example
 * ```ts
 * import { scoreResume } from '@abdullah1bit/job-scanner';
 *
 * const result = scoreResume(resumeText);
 * console.log(result.overall); // 72
 * console.log(result.band);    // 'minor_fixes'
 * ```
 */
export function scoreResume(text: string, options: ScoreOptions = {}): AtsScore {
  if (typeof text !== 'string') {
    throw new Error('Resume text must be a string');
  }
  if (text.length < 50) {
    throw new Error('Resume text must be at least 50 characters');
  }

  const dimensions = {
    length: scoreLength(text),
    sections: scoreSections(text),
    actionVerbs: scoreActionVerbs(text),
    quantified: scoreQuantified(text),
    contact: scoreContact(text),
    dates: scoreDates(text),
    bulletDensity: scoreBulletDensity(text),
    atsRedFlags: scoreAtsRedFlags(text),
  };

  const overall = computeOverall(dimensions);
  const band = computeBand(overall);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const summary = options.targetRole
    ? `Resume scored ${overall}/100 (${band.replace(/_/g, ' ')}) for "${options.targetRole}".`
    : `Resume scored ${overall}/100 (${band.replace(/_/g, ' ')}).`;

  return {
    overall,
    band,
    wordCount,
    charCount: text.length,
    dimensions,
    redFlags: [],
    summary,
    topFixes: [],
  };
}
