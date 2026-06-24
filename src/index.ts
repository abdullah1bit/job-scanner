import { scoreResume } from './score';
import { matchResumeToJD, extractKeywords } from './match';

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
} from './types';

export { scoreResume, matchResumeToJD, extractKeywords };
