/**
 * Synonym groups for common resume / job-description terms.
 * Each group contains equivalent terms; when matching, any variant matches
 * the canonical term.
 *
 * Defeats the "dumb parser" critique: "React.js" matches "React",
 * "Postgres" matches "PostgreSQL", "Node" matches "Node.js", etc.
 *
 * Word-boundary matching is used to avoid false positives
 * (e.g. "Go" matching the verb "go" in any sentence).
 */
export const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  // JavaScript ecosystem
  ['react', 'reactjs', 'react.js'],
  ['node', 'nodejs', 'node.js'],
  ['vue', 'vuejs', 'vue.js'],
  ['next', 'nextjs', 'next.js'],
  ['nuxt', 'nuxtjs', 'nuxt.js'],
  ['angular', 'angularjs'],
  ['svelte', 'sveltekit'],
  ['express', 'expressjs', 'express.js'],
  ['nestjs', 'nest.js'],

  // Databases
  ['postgres', 'postgresql', 'psql'],
  ['mongo', 'mongodb'],
  ['mysql', 'mariadb'],
  ['redis', 'redis cache'],
  ['dynamodb', 'dynamo'],
  ['bigquery', 'big query', 'gbq'],
  ['snowflake', 'snowflake db'],

  // Cloud
  ['aws', 'amazon web services'],
  ['gcp', 'google cloud', 'google cloud platform'],
  ['azure', 'microsoft azure'],

  // DevOps
  ['k8s', 'kubernetes'],
  ['ci/cd', 'cicd', 'continuous integration', 'continuous delivery'],
  ['terraform', 'tf', 'iac'],

  // Languages
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['py', 'python'],
  ['rb', 'ruby'],
  ['go', 'golang'],
  ['cpp', 'c++'],
  ['cs', 'c#'],

  // Common role aliases
  ['pm', 'product manager'],
  ['swe', 'software engineer', 'sde'],
  ['sre', 'site reliability engineer', 'devops engineer'],
  ['ux', 'user experience', 'ux design'],
  ['ui', 'user interface', 'ui design'],
  ['qa', 'quality assurance', 'test engineer', 'sdet'],
  ['ml', 'machine learning', 'ml engineer'],
  ['ai', 'artificial intelligence'],
  ['nlp', 'natural language processing'],
  ['api', 'rest api', 'restful api', 'graphql'],
  ['fe', 'frontend', 'front-end', 'front end'],
  ['be', 'backend', 'back-end', 'back end'],
  ['fs', 'fullstack', 'full-stack', 'full stack'],

  // Methodologies
  ['agile', 'scrum', 'kanban'],
  ['tdd', 'test driven development', 'test-driven development'],
  ['oop', 'object oriented programming', 'object-oriented'],

  // Tools
  ['git', 'github', 'gitlab', 'bitbucket'],
  ['jira', 'atlassian', 'confluence'],
  ['figma', 'sketch', 'xd', 'adobe xd'],
  ['slack', 'microsoft teams', 'teams'],

  // Business terms
  ['b2b', 'business to business'],
  ['b2c', 'business to consumer'],
  ['saas', 'software as a service'],
  ['crm', 'customer relationship management', 'salesforce'],
  ['erp', 'enterprise resource planning', 'sap'],
  ['kpi', 'key performance indicator', 'metric', 'metrics'],
  ['roi', 'return on investment'],
  ['seo', 'search engine optimization'],
  ['ux research', 'user research', 'design research'],

  // Data
  ['etl', 'elt', 'data pipeline', 'data ingestion'],
  ['olap', 'analytical', 'analytics'],
  ['oltp', 'transactional'],
  ['sql', 'structured query language'],
  ['nosql', 'non-relational'],
];

/**
 * Build a lookup map: each canonical term → all variants (including itself).
 */
export function buildSynonymLookup(): Map<string, Set<string>> {
  const lookup = new Map<string, Set<string>>();
  for (const group of SYNONYM_GROUPS) {
    const canonical = group[0];
    const variants = new Set<string>(group);
    lookup.set(canonical, variants);
  }
  return lookup;
}

/**
 * Get all variants for a given keyword. Returns [keyword] if no synonyms exist.
 */
export function getVariants(keyword: string, lookup: Map<string, Set<string>>): string[] {
  for (const [, variants] of lookup) {
    if (variants.has(keyword)) {
      return Array.from(variants);
    }
  }
  return [keyword];
}
