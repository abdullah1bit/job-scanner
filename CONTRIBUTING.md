# Contributing to @abdullah1bit/job-scanner

Thanks for considering a PR! This project aims to be small, focused, and well-tested.

## In scope

- New scoring dimensions (see [docs/dimensions.md](./docs/dimensions.md))
- New match algorithm improvements (see [docs/match.md](./docs/match.md))
- Language support (new `verb-list.{lang}.ts`, `section-patterns.{lang}.ts`, `stopwords.{lang}.ts`)
- Synonym groups (common terms with abbreviations/aliases)
- Bug fixes
- Documentation improvements
- Test fixtures (especially: edge cases, non-English resumes, role-specific benchmarks)

## Out of scope (for now)

- LLM-based scoring (we are explicitly deterministic)
- Resume rewriting or generation
- Template/style recommendations
- Anything that adds a runtime dependency

## Adding a new dimension

1. Create `src/dimensions/{your-dimension}.ts`
2. Implement `score{YourDimension}(text: string): ScoreDimension`
3. Add it to the `dimensions` object in `src/score.ts`
4. Add tests in `test/dimensions/{your-dimension}.test.ts`
5. Add at least 3 fixtures in `test/fixtures/resumes/`
6. Document it in `docs/dimensions.md`
7. Update the dimension weights in `src/constants/thresholds.ts`

## Adding a new match feature

1. Create `src/match/{your-feature}.ts`
2. Wire it into `src/match.ts` if needed
3. Add tests in `test/match/{your-feature}.test.ts`
4. Add at least 3 fixtures in `test/fixtures/jds/`
5. Document it in `docs/match.md`

## Adding language support

1. Create `src/constants/stopwords.{lang}.ts` with a `STOPWORDS_{LANG}: ReadonlySet<string>` export
2. Create `src/constants/verb-list.{lang}.ts` with a `STRONG_VERBS_{LANG}: ReadonlySet<string>` export
3. Create `src/constants/section-patterns.{lang}.ts` with localized `SECTION_PATTERNS_{LANG}`
4. Update the language switcher logic in `src/score.ts` and `src/match.ts`
5. Add test fixtures in `test/fixtures/resumes/{lang}/` and `test/fixtures/jds/{lang}/`
6. Document in `docs/dimensions.md`

## Running tests

```bash
npm install
npm test
```

All PRs must pass CI (lint + test + build).

## Coding style

- TypeScript strict mode (no `any`, no implicit returns)
- **No runtime dependencies** (build tools are fine)
- Functions under 100 lines
- 80%+ test coverage on `src/`
- Use the existing regex/dictionary patterns where possible
- All public APIs must have JSDoc comments
- All new dimensions must have test cases + fixtures

## Reporting issues

Please use the issue templates. For questions, use [GitHub Discussions](https://github.com/abdullah1bit/job-scanner/discussions) — not issues.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add bullet density dimension`
- `fix: handle missing email in contact dimension`
- `docs: explain synonym matching in README`
- `chore: bump vitest to 1.7`
- `feat!: drop Node 16 support` (breaking change)

This drives automatic changelog generation via semantic-release.

## Release process

Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release):

- `feat:` commits trigger a `minor` version bump
- `fix:` commits trigger a `patch` version bump
- `BREAKING CHANGE:` in the footer or `!` after the type triggers a `major` version bump
- `chore:`, `docs:`, `test:`, `style:`, `refactor:` do not trigger a release

The release workflow runs on every push to `main`, after CI passes.
