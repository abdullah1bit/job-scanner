import type { ScoreDimension } from '../types';

export function scoreSections(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Core sections',
    value: 'Not implemented',
    message: 'Sections dimension pending implementation.',
    suggestion: '',
  };
}
