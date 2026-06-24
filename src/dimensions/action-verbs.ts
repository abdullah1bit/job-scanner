import type { ScoreDimension } from '../types';

export function scoreActionVerbs(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Action verbs',
    value: 'Not implemented',
    message: 'Action verbs dimension pending implementation.',
    suggestion: '',
  };
}
