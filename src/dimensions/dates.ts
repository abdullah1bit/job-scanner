import type { ScoreDimension } from '../types';

export function scoreDates(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Date format',
    value: 'Not implemented',
    message: 'Dates dimension pending implementation.',
    suggestion: '',
  };
}
