/**
 * Curated list of strong action verbs used to start resume bullet points.
 * Lowercased; matched against the first word of each bullet line.
 *
 * Sources: O*NET, resume guidance from major career services, common patterns
 * across thousands of reviewed resumes. Grouped by impact strength.
 */
export const STRONG_VERBS: ReadonlySet<string> = new Set([
  // Leadership & ownership
  'led', 'headed', 'directed', 'managed', 'supervised', 'oversaw', 'coordinated',
  'spearheaded', 'championed', 'drove', 'steered', 'orchestrated', 'facilitated',
  'mobilized', 'rallied',

  // Creation & building
  'built', 'created', 'designed', 'developed', 'engineered', 'architected',
  'founded', 'established', 'launched', 'pioneered', 'introduced', 'authored',
  'crafted', 'forged', 'conceived',

  // Improvement & optimization
  'improved', 'optimized', 'streamlined', 'enhanced', 'refactored', 'revamped',
  'overhauled', 'redesigned', 'modernized', 'transformed', 'restructured',
  'reformed', 'rebuilt', 'rebuilt', 'consolidated', 'unified',

  // Growth & impact
  'increased', 'grew', 'expanded', 'scaled', 'accelerated', 'amplified',
  'doubled', 'tripled', 'maximized', 'boosted', 'elevated',

  // Reduction & efficiency
  'reduced', 'cut', 'slashed', 'decreased', 'minimized', 'eliminated',
  'saved', 'conserved', 'curtailed',

  // Achievement & delivery
  'achieved', 'delivered', 'exceeded', 'attained', 'accomplished', 'completed',
  'executed', 'shipped', 'landed',

  // Analysis & strategy
  'analyzed', 'researched', 'evaluated', 'assessed', 'audited', 'investigated',
  'identified', 'diagnosed', 'forecasted', 'modeled', 'quantified',

  // Negotiation & influence
  'negotiated', 'persuaded', 'influenced', 'convinced', 'closed', 'secured',
  'partnered', 'cultivated',

  // Mentorship & enablement
  'mentored', 'coached', 'trained', 'taught', 'educated', 'guided',
  'onboarded', 'developed',

  // Recognition
  'awarded', 'recognized', 'honored', 'selected', 'nominated', 'promoted',
  'appointed', 'elected',

  // Communication
  'presented', 'published', 'documented', 'reported', 'communicated',
  'articulated', 'advocated', 'briefed',

  // Technical execution
  'implemented', 'deployed', 'integrated', 'migrated', 'automated',
  'instrumented', 'configured', 'set', 'rolled',

  // Problem solving
  'solved', 'resolved', 'debugged', 'diagnosed', 'remediated', 'mitigated',
  'addressed', 'repaired', 'fixed',

  // Planning
  'planned', 'organized', 'prioritized', 'scheduled', 'budgeted',
  'forecasted', 'mapped', 'outlined',

  // Initiation
  'initiated', 'proposed', 'recommended', 'identified', 'spotted',
  'recognized', 'sparked', 'triggered',
]);

/**
 * Phrases that look like action verbs but are weak. Used as a reference; we
 * don't penalize these, just don't count them as strong.
 */
export const WEAK_VERBS: ReadonlySet<string> = new Set([
  'helped', 'assisted', 'supported', 'worked', 'did', 'made', 'used',
  'handled', 'responsible', 'involved', 'participated', 'contributed',
]);
