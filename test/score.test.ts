import { describe, it, expect, vi } from 'vitest';
import { scoreResume, matchResumeToJD, extractKeywords } from '../src';

describe('package exports', () => {
  it('exports scoreResume', () => {
    expect(typeof scoreResume).toBe('function');
  });

  it('exports matchResumeToJD', () => {
    expect(typeof matchResumeToJD).toBe('function');
  });

  it('exports extractKeywords', () => {
    expect(typeof extractKeywords).toBe('function');
  });
});

describe('scoreResume', () => {
  const sampleResume = `
John Doe
Software Engineer
Experience
Senior Software Engineer at Acme Corp
2020 - 2023
• Led team of 5 engineers
• Built features serving 1M users
• Increased revenue by 23%

Software Engineer at BetaCo
2018 - 2020
• Developed React components
• Managed CI/CD pipeline
• Reduced bug count by 40%

Education
BS Computer Science, State University, 2018

Skills
JavaScript, TypeScript, React, Node.js, AWS, Docker
`.trim();

  it('returns a valid AtsScore for a sample resume', () => {
    const result = scoreResume(sampleResume);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
    expect(result.band).toMatch(/ats_ready|minor_fixes|major_fixes|critical_issues/);
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.charCount).toBeGreaterThan(0);
  });

  it('rejects input shorter than 50 characters', () => {
    expect(() => scoreResume('too short')).toThrow();
  });

  it('rejects non-string input', () => {
    expect(() => scoreResume(null as unknown as string)).toThrow();
    expect(() => scoreResume(undefined as unknown as string)).toThrow();
    expect(() => scoreResume(123 as unknown as string)).toThrow();
  });

  it('returns all 8 dimensions', () => {
    const result = scoreResume(sampleResume);
    expect(result.dimensions).toHaveProperty('length');
    expect(result.dimensions).toHaveProperty('sections');
    expect(result.dimensions).toHaveProperty('actionVerbs');
    expect(result.dimensions).toHaveProperty('quantified');
    expect(result.dimensions).toHaveProperty('contact');
    expect(result.dimensions).toHaveProperty('dates');
    expect(result.dimensions).toHaveProperty('bulletDensity');
    expect(result.dimensions).toHaveProperty('atsRedFlags');
  });
});

describe('matchResumeToJD', () => {
  const resume = 'Experienced with React, Node.js, and PostgreSQL. Built APIs and worked on AWS.';
  const jd = `
    We are looking for a Senior Engineer with React, Node.js, PostgreSQL, AWS experience.
    You will build APIs and work with our team to deliver features.
  `;

  it('returns a valid MatchResult (async)', async () => {
    const result = await matchResumeToJD(resume, jd);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.band).toMatch(/strong_match|partial_match|weak_match|no_match/);
  });

  it('returns no_match for empty JD', async () => {
    const result = await matchResumeToJD(resume, '');
    expect(result.band).toBe('no_match');
    expect(result.totalKeywords).toBe(0);
  });

  it('accepts pre-computed semanticConcepts', async () => {
    const result = await matchResumeToJD(resume, jd, {
      semanticConcepts: ['distributed systems', 'observability'],
    });
    // The total keyword count should include the semantic concepts
    expect(result.totalKeywords).toBeGreaterThan(0);
  });

  it('accepts an async aiConceptExtractor hook (BYO LLM)', async () => {
    const aiConceptExtractor = vi.fn(async (_jd: string) => [
      'scalable systems',
      'observability',
    ]);

    const result = await matchResumeToJD(resume, jd, {
      aiConceptExtractor,
    });

    expect(aiConceptExtractor).toHaveBeenCalledOnce();
    expect(aiConceptExtractor).toHaveBeenCalledWith(jd);
    expect(result.totalKeywords).toBeGreaterThan(0);
  });

  it('falls back to deterministic when aiConceptExtractor throws', async () => {
    const aiConceptExtractor = vi.fn(async () => {
      throw new Error('LLM unavailable');
    });

    const result = await matchResumeToJD(resume, jd, {
      aiConceptExtractor,
    });

    // Should not throw, should return a valid result with deterministic only
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(aiConceptExtractor).toHaveBeenCalledOnce();
  });

  it('prefers pre-computed semanticConcepts over the hook (cache wins)', async () => {
    const aiConceptExtractor = vi.fn(async () => ['from-hook']);

    const result = await matchResumeToJD(resume, jd, {
      semanticConcepts: ['from-cache'],
      aiConceptExtractor,
    });

    // Hook should NOT be called if pre-computed concepts are provided
    expect(aiConceptExtractor).not.toHaveBeenCalled();
    expect(result.totalKeywords).toBeGreaterThan(0);
  });
});

describe('extractKeywords', () => {
  it('extracts top keywords from a JD', () => {
    const jd = 'Looking for React developer with Node.js experience and AWS knowledge.';
    const keywords = extractKeywords(jd);
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.length).toBeLessThanOrEqual(20);
  });

  it('returns empty array for empty input', () => {
    const keywords = extractKeywords('');
    expect(keywords).toEqual([]);
  });
});
