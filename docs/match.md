# Match Algorithm

The `matchResumeToJD` function computes a 0-100 match score between a resume and a job description, identifying which keywords are present and which are missing.

## Overview

```
Input: resume text + job description
       ↓
[Step 1] Extract keywords from JD (top 20 by weighted frequency)
       ↓
[Step 2] For each keyword, check if it appears in the resume
       ↓
[Step 3] Compute weighted match score
       ↓
[Step 4] Categorize missing keywords (skills / experience / domain)
       ↓
[Step 5] Generate top fixes (1-3 actionable suggestions)
       ↓
Output: MatchResult with score, band, matched/missing keywords, fixes
```

## Step 1: Keyword extraction

We extract keywords from the job description using position-weighted frequency:

- **Title** (first line) gets 3x weight
- **First paragraph** (first 3 lines) gets 2x weight
- **Body** (remaining lines) gets 1x weight

Stopwords (a, the, and, etc.) are filtered out. Only tokens >2 chars are considered.

Returns top 20 keywords by weight.

## Step 2: Matching

For each extracted keyword, we check if it appears in the resume (case-insensitive substring match). Future versions will add:

- **Synonym matching** (React ≈ React.js ≈ ReactJS)
- **Semantic matching** (when AI-extracted concepts are provided via `options.semanticConcepts`)
- **Word boundary matching** (to avoid false positives like "Go" matching "going")

## Step 3: Score calculation

The match score is a weighted percentage:

```
match_score = (sum of matched keyword weights) / (sum of all keyword weights) * 100
```

This means a keyword in the title of the JD contributes more to the score than a keyword in the body.

## Step 4: Categorization

Missing keywords are categorized as one of:

| Category | Examples |
|----------|----------|
| `skills` | JavaScript, React, AWS, Docker |
| `experience` | 5+ years, senior, lead |
| `domain` | fintech, healthcare, B2B SaaS |
| `other` | anything that doesn't fit the above |

The categorization uses regex patterns (e.g., years-suffix for experience, common-tech-terms for skills).

## Step 5: Top fixes

Generates 1-3 actionable suggestions based on the missing keywords. For example:

- "Add 'Kubernetes' to your skills section or a relevant bullet."
- "Highlight experience related to '5+ years'."
- "Consider adding 'fintech' to your resume if applicable."

## Match bands

| Score | Band |
|-------|------|
| 70+ | `strong_match` — Your resume covers the key requirements well. |
| 40-69 | `partial_match` — Partial coverage. Top gap: "{keyword}". |
| 20-39 | `weak_match` — Needs significant tailoring. |
| <20 | `no_match` — Resume needs major rework for this role. |

## Synonyms

The matcher includes a synonyms dictionary to handle common equivalent terms:

- `React.js` ≈ `React` ≈ `ReactJS`
- `Node` ≈ `Node.js` ≈ `NodeJS`
- `Postgres` ≈ `PostgreSQL` ≈ `PSQL`
- `k8s` ≈ `Kubernetes`
- `JS` ≈ `JavaScript`
- ...50+ groups

See [`src/constants/synonyms.ts`](../src/constants/synonyms.ts) for the full list. PRs welcome to add more.

## AI-enhanced matching

When you call the public API with `semanticConcepts` (from the AI extraction endpoint), those concepts are merged with the deterministic keywords at higher weight. This catches cases where:

- The JD uses a synonym not in our dictionary
- The JD uses a concept that doesn't reduce to a single keyword (e.g., "experience building scalable distributed systems")
- The resume uses the same concept with different wording

The AI layer is a thin wrapper that does 1 bounded LLM call (max 500 tokens in, 200 out) with prompt-injection protection.

## Limitations

- **Single-language:** Currently English only. Language support is planned.
- **No word boundary matching:** "Go" can match "going" — this is a known issue, being fixed.
- **No stemming:** "manage" and "managed" are treated as different keywords. Stemming is a possible future enhancement.
- **No contextual understanding:** "Led team of 5" doesn't get extra credit for the team size being a relevant scale signal. The AI-enhanced mode handles this.

## Contributing to the match algorithm

1. Update the relevant files in `src/match/` or `src/constants/`
2. Add tests in `test/match/`
3. Add fixtures in `test/fixtures/jds/`
4. Document changes here
