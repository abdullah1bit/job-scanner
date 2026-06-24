import type { ScoreDimension } from '../types';

export function scoreLength(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Resume length',
    value: 'Not implemented',
    message: 'Length dimension pending implementation.',
    suggestion: '',
  };
}
