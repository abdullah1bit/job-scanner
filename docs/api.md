# API Reference

## `scoreResume(text, options?)`

Scores a resume against the 8 deterministic ATS dimensions.

### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | The resume text (50-20000 chars recommended) |
| `options.targetRole` | `string` | — | Optional target role (currently unused but reserved) |
| `options.language` | `string` | `'en'` | Language code (currently English only) |

### Returns

`AtsScore` — see [types](./../src/types.ts) for the full type definition.

```typescript
interface AtsScore {
  overall: number;          // 0-100 weighted average
  band: ScoreBand;          // 'ats_ready' | 'minor_fixes' | 'major_fixes' | 'critical_issues'
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
```

### Throws

- `Error` if `text` is not a string
- `Error` if `text` is shorter than 50 characters

## `matchResumeToJD(resumeText, jobDescription, options?)`

Matches a resume against a job description, returning a match score and missing keywords.

### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `resumeText` | `string` | required | The resume text |
| `jobDescription` | `string` | required | The job description text |
| `options.targetRole` | `string` | — | Optional target role (currently unused but reserved) |
| `options.language` | `string` | `'en'` | Language code |
| `options.semanticConcepts` | `string[]` | — | AI-extracted concepts to merge with deterministic keywords (use this for AI-enhanced matching) |

### Returns

`MatchResult`:

```typescript
interface MatchResult {
  score: number;             // 0-100
  band: MatchBand;           // 'strong_match' | 'partial_match' | 'weak_match' | 'no_match'
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
```

## `extractKeywords(text, options?)`

Extracts top keywords from a job description.

### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | The job description text |
| `options.maxKeywords` | `number` | `20` | Max keywords to return |
| `options.language` | `string` | `'en'` | Language code |

### Returns

`Keyword[]`:

```typescript
interface Keyword {
  keyword: string;
  weight: number;
  category: KeywordCategory;  // 'skills' | 'experience' | 'domain' | 'other'
}
```

## Score bands

### ATS score (`AtsScore.band`)

| Score | Band |
|-------|------|
| 85+ | `ats_ready` |
| 70-84 | `minor_fixes` |
| 50-69 | `major_fixes` |
| <50 | `critical_issues` |

### Match score (`MatchResult.band`)

| Score | Band |
|-------|------|
| 70+ | `strong_match` |
| 40-69 | `partial_match` |
| 20-39 | `weak_match` |
| <20 | `no_match` |

## Score weights

The 8 dimensions are weighted as follows when computing the overall score:

| Dimension | Weight |
|-----------|--------|
| Length | 10% |
| Sections | 15% |
| Action verbs | 15% |
| Quantified achievements | 20% |
| Contact info | 10% |
| Date format | 5% |
| Bullet density | 10% |
| ATS red flags | 15% |

Quantified achievements get the highest weight because they're the single best predictor of resume impact.
