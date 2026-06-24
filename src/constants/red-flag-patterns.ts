/**
 * Regex patterns for detecting ATS red flags in a resume.
 * Each pattern returns true if the flag is present.
 */
export const RED_FLAG_PATTERNS = {
  // Pipe-separated values (table hint)
  tableHint: /\|.*\|/,

  // Tab-separated columns
  tabColumns: /\t\S+\t/,

  // Special bullets / shapes that confuse parsers
  specialBullet: /[•★◆▶◀→←↑↓■□●○]/u,

  // Email obfuscation
  emailObfuscation: /\[at\]|\(at\)|@.*\[dot\]/i,

  // Image references (markdown or plain)
  imageMarker: /\[image:|!\[.*\]\(.*\)/i,

  // Excessive whitespace / blank lines (broken formatting)
  excessiveWhitespace: /\n{4,}| {6,}/,

  // Page numbers in headers/footers
  headerFooter: /^page \d+ of \d+$/im,

  // Decorative borders
  decorativeBorder: /^[=\-_*]{10,}$/m,
} as const;

export type RedFlagKey = keyof typeof RED_FLAG_PATTERNS;

/**
 * Human-readable labels for each red flag.
 */
export const RED_FLAG_LABELS: Record<RedFlagKey, string> = {
  tableHint: 'Table-like layout (pipe-separated values)',
  tabColumns: 'Tab-separated columns',
  specialBullet: 'Special bullet character',
  emailObfuscation: 'Email obfuscation',
  imageMarker: 'Image reference',
  excessiveWhitespace: 'Excessive whitespace',
  headerFooter: 'Page header/footer text',
  decorativeBorder: 'Decorative border',
};
