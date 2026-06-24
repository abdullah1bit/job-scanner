# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial repository structure
- Public API: `scoreResume`, `matchResumeToJD`, `extractKeywords`
- 8 scoring dimensions (stubs to be implemented in upcoming releases)
- TypeScript types and Zod-compatible interfaces
- Constants: action verb list (140+ verbs), section patterns, red flag patterns, stopwords, synonyms (50+ groups)
- GitHub Actions CI workflow (lint + test + build)
- Renovate config for automated dependency updates

### Planned

- Full implementation of the 8 scoring dimensions
- Match algorithm with synonym-aware keyword extraction
- Top fixes generator
- Bilingual support (English first, others via PRs)
- Coverage reporting
