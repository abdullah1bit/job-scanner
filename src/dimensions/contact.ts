import type { ScoreDimension } from '../types';

export function scoreContact(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Contact info',
    value: 'Not implemented',
    message: 'Contact dimension pending implementation.',
    suggestion: '',
  };
}
