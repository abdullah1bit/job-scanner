import type { ScoreDimension } from '../types';

export function scoreBulletDensity(_text: string): ScoreDimension {
  return {
    score: 0,
    status: 'critical',
    label: 'Bullets per role',
    value: 'Not implemented',
    message: 'Bullet density dimension pending implementation.',
    suggestion: '',
  };
}
