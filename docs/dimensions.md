# The 8 Scoring Dimensions

The ATS score is a weighted average of 8 structural dimensions. Each dimension returns a `ScoreDimension` object with a 0-100 score, a status (`good`, `needs_work`, `critical`), a human-readable value, and an actionable suggestion.

## 1. Length (weight: 10%)

| Word count | Score | Status |
|---|---|---|
| 200-700 | 100 | good (1-page ideal) |
| 700-1200 | 90 | good (2-page ideal) |
| <200 | 30-70 (scaled) | critical (<100) / needs_work (100-200) |
| >1200 | 40-80 (scaled) | needs_work |

**Why it matters:** Recruiters spend 6-8 seconds scanning. Too long = ignored.

## 2. Sections (weight: 15%)

Regex match for the 4 core sections: Summary, Experience, Education, Skills.

| Sections found | Score |
|---|---|
| 4/4 | 100 |
| 3/4 | 75 |
| 2/4 | 50 |
| 1/4 | 25 |
| 0/4 | 0 |

**Why it matters:** Missing sections confuse ATS parsers.

## 3. Action verbs (weight: 15%)

% of bullet lines that start with a verb from a curated list of ~140 strong verbs.

| % bullets with strong verb | Score |
|---|---|
| 70%+ | 100 |
| 50-70% | 75 |
| 30-50% | 50 |
| <30% | 25 |

**Why it matters:** Passive bullets look weak. Active verbs show ownership.

**Verb list:** see [`src/constants/verb-list.ts`](../src/constants/verb-list.ts).

## 4. Quantified achievements (weight: 20%) — highest weight

% of bullet lines containing a number, %, $, k, or scale indicator.

| % bullets quantified | Score |
|---|---|
| 50%+ | 100 |
| 30-50% | 75 |
| 10-30% | 50 |
| <10% | 25 |

**Why it matters:** Quantified achievements are the #1 predictor of resume impact. "Increased revenue by 23%" lands; "Responsible for revenue" doesn't.

## 5. Contact info (weight: 10%)

Regex for email, phone, LinkedIn.

| Found | Score |
|---|---|
| 3/3 | 100 |
| 2/3 | 70 |
| 1/3 | 40 |
| 0/3 | 0 |

**Why it matters:** ATS needs contact info to associate you with the application.

## 6. Date format (weight: 5%)

Detect format per line (Mon YYYY, MM/YYYY, YYYY-only). All same = 100, mixed = 30, missing = 50.

**Why it matters:** Mixed formats look unprofessional and confuse parsers.

## 7. Bullet density (weight: 10%)

Bullets per role entry. 3-6 ideal.

| Bullets per role | Score |
|---|---|
| 3-6 | 100 |
| 2 or 7 | 75 |
| 1 or 8+ | 50 |
| 0 | 10 |

**Why it matters:** Too few = thin experience. Too many = bloated.

## 8. ATS red flags (weight: 15%)

Detects: pipe-separated values (table hint), tab columns, special bullets (•, ★, etc.), email obfuscation, image references, excessive whitespace, page header/footer text, decorative borders.

| Red flags | Score |
|---|---|
| 0 | 100 |
| 1-2 | 70 |
| 3-4 | 40 |
| 5+ | 10 |

**Why it matters:** Many ATS systems silently drop resumes with these patterns.

**Pattern list:** see [`src/constants/red-flag-patterns.ts`](../src/constants/red-flag-patterns.ts).

## Dimension weights

| Dimension | Weight |
|-----------|--------|
| Length | 10% |
| Sections | 15% |
| Action verbs | 15% |
| Quantified achievements | **20%** |
| Contact info | 10% |
| Date format | 5% |
| Bullet density | 10% |
| ATS red flags | 15% |

Total: 100%. Quantified achievements get the highest weight because they're the single best predictor of resume impact.

## Adding a new dimension

1. Implement the function in `src/dimensions/{name}.ts`
2. Add it to the `dimensions` object in `src/score.ts`
3. Add tests in `test/dimensions/{name}.test.ts`
4. Add at least 3 fixtures in `test/fixtures/resumes/`
5. Update the weights in `src/constants/thresholds.ts` to maintain 100% total
6. Document it here
