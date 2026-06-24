import type { ScoreDimension } from '../types';

export function scoreQuantified(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Quantified achievements',
    value: 'Not implemented',
    message: 'Quantified dimension pending implementation.',
    suggestion: '',
  };
}
