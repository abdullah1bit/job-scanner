import { scoreResume } from './score';
import { matchResumeToJD, extractKeywords } from './match';
import {
  buildConceptExtractionPrompt,
  buildSafeConceptExtractionPrompt,
  parseConceptExtractionResponse,
} from './ai/extract-concepts';

export type {
  AtsScore,
  ScoreDimension,
  ScoreBand,
  ScoreStatus,
  ScoreOptions,
  MatchResult,
  MatchBand,
  MatchedKeyword,
  MissingKeyword,
  MatchOptions,
  Keyword,
  KeywordCategory,
  KeywordImportance,
  KeywordOptions,
  MatchEnhancer,
} from './types';

export type { ConceptExtractionPromptOptions } from './ai/extract-concepts';

export {
  scoreResume,
  matchResumeToJD,
  extractKeywords,
  buildConceptExtractionPrompt,
  buildSafeConceptExtractionPrompt,
  parseConceptExtractionResponse,
};
