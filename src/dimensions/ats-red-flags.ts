import type { ScoreDimension } from '../types';

export function scoreAtsRedFlags(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'ATS safety',
    value: 'Not implemented',
    message: 'ATS red flags dimension pending implementation.',
    suggestion: '',
  };
}
