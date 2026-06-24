# @resumepolish/ats-scorer

[![npm version](https://img.shields.io/npm/v/@resumepolish/ats-scorer.svg)](https://www.npmjs.com/package/@resumepolish/ats-scorer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Build Status](https://github.com/resumepolish/ats-scorer/workflows/CI/badge.svg)](https://github.com/resumepolish/ats-scorer/actions)
[![Downloads](https://img.shields.io/npm/dm/@resumepolish/ats-scorer.svg)](https://www.npmjs.com/package/@resumepolish/ats-scorer)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> A deterministic, transparent ATS resume scoring engine. 8 rules, no black box, no LLM. Includes resume-to-job-description matching with synonym-aware keyword extraction.

[**Live demo →**](https://resumepolish.app/free-ats-check) · [**Why we open-sourced this →**](https://resumepolish.app/blog/why-we-open-sourced-our-ats-scoring) · [**Get the AI rewrite →**](https://resumepolish.app)

---

## Why open source?

Every ATS score you've ever seen is a black box. You paste your resume, you get a number, you have no idea why. We think that's broken. So we built ours around 8 transparent, testable rules — and we open-sourced them.

**What this scores:** structural ATS safety — length, sections, action verbs, quantified achievements, contact info, date format, bullet density, ATS red flags.

**What this doesn't score:** content quality, role fit, narrative, evidence strength. For that, [try our AI rewrite](https://resumepolish.app).

We believe the structural score should be free, public, and auditable. The AI rewrite is a separate product.

## What this also does: resume-to-job-description match

Paste a resume + a job description, get a match score showing which keywords/concepts from the JD are present in the resume and which are missing. Useful for tailoring a resume to a specific job.

```typescript
import { scoreResume, matchResumeToJD } from '@resumepolish/ats-scorer';

const atsResult = scoreResume(resumeText);
const matchResult = matchResumeToJD(resumeText, jobDescription);

console.log(atsResult.overall);     // 72
console.log(matchResult.score);     // 45
console.log(matchResult.missingKeywords); // ['kubernetes', 'postgresql', ...]
```

## Quick start

```bash
npm install @resumepolish/ats-scorer
```

```typescript
import { scoreResume } from '@resumepolish/ats-scorer';

const result = scoreResume(resumeText);

console.log(result.overall);      // 72
console.log(result.band);         // 'minor_fixes'
console.log(result.dimensions.actionVerbs);
// { score: 50, status: 'needs_work', label: 'Action verbs', value: '32% of bullets', ... }
```

**Zero runtime dependencies.** Runs in ~10ms. Works in Node 18+, browsers, and edge runtimes.

## The 8 scoring dimensions

| # | Dimension | What it measures | Why it matters |
|---|---|---|---|
| 1 | **Length** | Word count vs 1-page / 2-page ideal ranges | Recruiters spend 6-8 seconds scanning. Too long = ignored. |
| 2 | **Sections** | Presence of Summary, Experience, Education, Skills | Missing sections confuse ATS parsers. |
| 3 | **Action verbs** | % of bullets starting with strong verbs | Passive bullets look weak; active verbs show ownership. |
| 4 | **Quantified achievements** | % of bullets with numbers, %, $, or scale | "Increased revenue by 23%" lands. "Responsible for revenue" doesn't. |
| 5 | **Contact info** | Email, phone, LinkedIn presence | ATS needs contact info to associate you with the application. |
| 6 | **Date format** | Consistency of date formats across roles | Mixed formats look unprofessional and confuse parsers. |
| 7 | **Bullet density** | Bullets per role (3-6 ideal) | Too few = thin experience. Too many = bloated. |
| 8 | **ATS red flags** | Special characters, table hints, image markers | Many ATS systems misread these. They silently drop your resume. |

[Full documentation of each dimension →](./docs/dimensions.md)

## The match score

| Output | What it means |
|---|---|
| `score` | 0-100, weighted by JD keyword importance |
| `band` | `strong_match` (70+) / `partial_match` (40-69) / `weak_match` (20-39) / `no_match` (<20) |
| `matchedKeywords` | JD keywords found in the resume |
| `missingKeywords` | Top 5-8 JD keywords not in the resume, categorized (skills, experience, domain) |
| `topFixes` | 1-3 actionable suggestions |

[Match algorithm details →](./docs/match.md)

## Synonyms

The matcher includes a synonyms dictionary so common equivalents are grouped:

- `React.js` ≈ `React` ≈ `ReactJS`
- `Node` ≈ `Node.js` ≈ `NodeJS`
- `Postgres` ≈ `PostgreSQL` ≈ `PSQL`
- `k8s` ≈ `Kubernetes`
- `JS` ≈ `JavaScript`
- `KPI` ≈ `metrics`
- ...50+ groups

See [`src/constants/synonyms.ts`](./src/constants/synonyms.ts) for the full list. PRs welcome to add more.

## Use it on the web

[resumepolish.app/free-ats-check](https://resumepolish.app/free-ats-check) — paste your resume, get a free score. No signup, no email required for the basic score.

## Public API

```bash
curl -X POST https://api.resumepolish.app/v1/score \
  -H "Content-Type: application/json" \
  -d '{"text":"John Doe\nSoftware Engineer\n..."}'
```

[API reference →](./docs/api.md) · 30 checks/day per IP, no auth.

## Benchmarks

We tested the scorer against 200 real resumes labeled by 3 recruiters. [See the data →](./docs/benchmarks.md)

## Why we built this

[Read the full story →](https://resumepolish.app/blog/why-we-open-sourced-our-ats-scoring)

## Contributing

We welcome PRs for:
- New scoring dimensions (with test cases)
- Language support (translated verb lists, non-English section patterns)
- Bug fixes
- Documentation improvements
- Test fixtures (especially: edge cases, non-English resumes, role-specific benchmarks)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](./LICENSE).

---

Built by [ResumePolish](https://resumepolish.app). Our AI rewrite starts at $7.
