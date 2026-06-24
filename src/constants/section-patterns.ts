/**
 * Regex patterns for detecting standard resume section headers.
 * Matched against each line of the resume (case-insensitive).
 */
export const SECTION_PATTERNS = {
  summary: /\b(summary|profile|professional summary|about|objective|career objective)\b/i,
  experience: /\b(experience|employment|work history|professional experience|work experience|career history)\b/i,
  education: /\b(education|academic|qualifications|academic background|educational background)\b/i,
  skills: /\b(skills|expertise|technical skills|competencies|proficiencies|technologies|tech stack)\b/i,
} as const;

export type SectionKey = keyof typeof SECTION_PATTERNS;

/**
 * All section keys that are considered "core" (4/4 = perfect score).
 */
export const CORE_SECTIONS: readonly SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
] as const;
